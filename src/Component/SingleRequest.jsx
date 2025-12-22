import React, {use} from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AuthContext from '../contexts/AuthContexts'


const SingleRequest = ({ request }) => {
  const { user } = use(AuthContext)
  const queryClient = useQueryClient()

  const { _id, assetName, assetType, requesterEmail, quantity, status } = request

  
  const profile = {
    employeeEmail: requesterEmail,
    hrEmail: user.email,
    assetName,
    assetType,
    quantity,
    status: 'active',
    date: new Date().toISOString(),
  }


  const { data: userData = {}, isLoading: userLoading } = useQuery({
    queryKey: ['user', user.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/users/${user.email}`)
      if (!res.ok) throw new Error('Failed to fetch user')
      return res.json()
    },
  })

  const { packageLimit: limit = 5, currentEmployees = 0 } = userData

  
  const acceptRequestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/requests/hrEmail/${_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      })
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries(['requests']),
  })

 
  const updateUserMutation = useMutation({
    mutationFn: async (newEmployeeCount) => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/users/${user.email}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageLimit: limit,
          currentEmployees: newEmployeeCount,
        }),
      })
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries(['user', user.email]),
  })

 
  const createAffiliationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/employeeAffiliation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      return res.json()
    },
  })

  
  const denyRequestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/requests/hrEmail/${_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'denied' }),
      })
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries(['requests']),
  })


  const { data: existingAffiliation, isLoading: affiliationLoading } = useQuery({
    queryKey: ['employeeAffiliation', requesterEmail],
    enabled: !!requesterEmail,
    queryFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/${requesterEmail}`)
      if (!res.ok) throw new Error('Failed to fetch affiliation')
      return res.json() 
    },
  })


  const handleAccept = () => {
    acceptRequestMutation.mutate()

    if (!existingAffiliation && currentEmployees < limit) {
      updateUserMutation.mutate(currentEmployees + 1)
      createAffiliationMutation.mutate()
    }
  }

  const handleDeny = () => {
    denyRequestMutation.mutate()
  }

  if (userLoading || affiliationLoading) return <p>Loading...</p>

  return (
    <div className="card p-5 text-black w-96">
      <div className="card-body bg-gray-300 items-center text-center">
        <h2 className="card-title">{assetName}</h2>
        <p>Type: {assetType}</p>
        <p>Requester Email: {requesterEmail}</p>
        <p>Quantity: {quantity}</p>
        <p className="font-bold">Status: {status}</p>

        <div className="card-actions justify-end">
          <button
            onClick={handleAccept}
            className="btn btn-primary"
            disabled={
              acceptRequestMutation.isLoading ||
              updateUserMutation.isLoading ||
              createAffiliationMutation.isLoading
            }
          >
            {acceptRequestMutation.isLoading ? 'Processing...' : 'Accept'}
          </button>
          <button
            onClick={handleDeny}
            className="btn btn-ghost"
            disabled={denyRequestMutation.isLoading}
          >
            {denyRequestMutation.isLoading ? 'Processing...' : 'Deny'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SingleRequest
