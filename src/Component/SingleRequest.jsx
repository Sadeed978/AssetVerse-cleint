import React, { use } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AuthContext from '../contexts/AuthContexts'

const statusStyle = {
  accepted: 'badge-success',
  denied:   'badge-error',
  pending:  'badge-warning',
}

const SingleRequest = ({ request }) => {
  const { user } = use(AuthContext)
  const qc = useQueryClient()
  const { _id, requesterName, companyName, assetName, assetType, requesterEmail, quantity, status, productQuantity } = request

  const profile = {
    employeeName: requesterName, employeeEmail: requesterEmail,
    hrEmail: user.email, companyName, assetName, assetType,
    quantity, status: 'active', date: new Date().toISOString(),
  }

  const { data: userData = {} } = useQuery({
    queryKey: ['user', user.email], enabled: !!user?.email,
    queryFn: async () => (await fetch(`https://asset-verse-server-phi.vercel.app/users/${user.email}`)).json(),
  })
  const { packageLimit: limit = 5, currentEmployees = 0 } = userData

  const { data: existingAffiliation } = useQuery({
    queryKey: ['employeeAffiliation', requesterEmail], enabled: !!requesterEmail,
    queryFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/${requesterEmail}`)
      return res.ok ? res.json() : null
    },
  })

  const acceptMut = useMutation({
    mutationFn: async () => (await fetch(`https://asset-verse-server-phi.vercel.app/requests/hrEmail/${_id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' }),
    })).json(),
    onSuccess: () => qc.invalidateQueries(['hrRequests']),
  })

  const denyMut = useMutation({
    mutationFn: async () => (await fetch(`https://asset-verse-server-phi.vercel.app/requests/hrEmail/${_id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'denied' }),
    })).json(),
    onSuccess: () => qc.invalidateQueries(['hrRequests']),
  })

  const updateUserMut = useMutation({
    mutationFn: async (n) => (await fetch(`https://asset-verse-server-phi.vercel.app/users/${user.email}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageLimit: limit, currentEmployees: n }),
    })).json(),
    onSuccess: () => qc.invalidateQueries(['user', user.email]),
  })

  const affiliateMut = useMutation({
    mutationFn: async () => (await fetch(`https://asset-verse-server-phi.vercel.app/employeeAffiliation`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })).json(),
  })

  const handleAccept = () => {
    acceptMut.mutate()
    if (!existingAffiliation && currentEmployees < limit) {
      updateUserMut.mutate(currentEmployees + 1)
      affiliateMut.mutate()
    }
  }

  const qty = quantity || productQuantity || '—'
  const badge = statusStyle[status?.toLowerCase()] || 'badge-neutral'

  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {assetName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">{assetName}</h3>
            <span className="text-xs text-base-content/40">{assetType}</span>
          </div>
        </div>
        <span className={`badge badge-sm ${badge} shrink-0`}>{status}</span>
      </div>

      {/* Details */}
      <div className="bg-base-200 rounded-xl px-4 py-3 flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-base-content/50">Requester</span>
          <span className="font-medium truncate max-w-[160px]">{requesterEmail}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/50">Quantity</span>
          <span className="font-medium">{qty}</span>
        </div>
        {companyName && (
          <div className="flex justify-between">
            <span className="text-base-content/50">Company</span>
            <span className="font-medium">{companyName}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-1">
        <button onClick={handleAccept} disabled={acceptMut.isPending}
          className="btn btn-primary btn-sm flex-1 rounded-xl">
          {acceptMut.isPending ? <span className="loading loading-spinner loading-xs" /> : '✅ Accept'}
        </button>
        <button onClick={() => denyMut.mutate()} disabled={denyMut.isPending}
          className="btn btn-outline btn-error btn-sm flex-1 rounded-xl">
          {denyMut.isPending ? <span className="loading loading-spinner loading-xs" /> : '❌ Deny'}
        </button>
      </div>
    </div>
  )
}

export default SingleRequest
