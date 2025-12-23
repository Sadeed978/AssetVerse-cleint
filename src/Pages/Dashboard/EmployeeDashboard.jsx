import React, { use} from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContexts';

const EmployeeDashboard = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;

  
  const { data: affiliation, isLoading: affLoading, isError: affError } = useQuery({
    queryKey: ['affiliation', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`
      );
      return res.data;
    },
  });

  const hrEmail = affiliation?.hrEmail;
  const companyName = affiliation?.companyName;

 
  const { data: requests = [], isLoading: reqLoading, isError: reqError } = useQuery({
    queryKey: ['requests', hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`
      );
      return res.data;
    },
  });

  const totalRequests = requests.length;
  const acceptedRequests = requests.filter(req => req.status === 'Accepted').length;
  const pendingRequests = totalRequests - acceptedRequests;

  
  if (affLoading || reqLoading) return <p className="text-center">Loading dashboard...</p>;
  if (affError || reqError) return <p className="text-center text-red-500">Something went wrong</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Employee Dashboard</h2>

      
        <div className="mb-8 p-6 bg-base-200 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Welcome to our  {companyName} </h3>
            
            <p className="text-gray-700">Here is a summary of your asset requests:</p>
        </div>

     
      <div className="stats shadow mb-6">
       
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <div className="stat-title">Total Requests</div>
          <div className="stat-value text-primary">{totalRequests}</div>
          <div className="stat-desc">All your asset requests</div>
        </div>

        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="stat-title">Accepted Requests</div>
          <div className="stat-value text-secondary">{acceptedRequests}</div>
          <div className="stat-desc">Requests approved by HR</div>
        </div>

        
        <div className="stat">
          <div className="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="stat-title">Pending / Rejected</div>
          <div className="stat-value text-accent">{pendingRequests}</div>
          <div className="stat-desc">Still waiting or rejected</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
