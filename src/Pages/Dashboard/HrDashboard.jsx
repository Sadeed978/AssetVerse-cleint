import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import AuthContext from '../../contexts/AuthContexts';

const COLORS = {
  Returnable: 'rgb(34,197,94)',        
  'Non-returnable': 'rgb(239,68,68)',  
  Bar: 'rgb(59,130,246)'               
};

const HrDashboard = () => {
  const { user } = use(AuthContext);
  const hrEmail = user.email;

  
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['hrAssets', hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/assets/hr/${hrEmail}`
      );
      return res.data;
    },
  });

  
  const { data: requests = [], isLoading: reqLoading } = useQuery({
    queryKey: ['hrRequests', hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`
      );
      return res.data;
    },
  });

  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ['hrEmployees', hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`
      );
      return res.data;
    },
  });

  if (assetsLoading || reqLoading || empLoading) {
    return <p className="text-center">Loading HR dashboard...</p>;
  }

  const returnableCount = assets.filter(
    asset => asset.productType === 'Returnable'
  ).length;

  const nonReturnableCount = assets.filter(
    asset => asset.productType === 'Non-returnable'
  ).length;

  const pieData = [
    { name: 'Returnable', value: returnableCount },
    { name: 'Non-returnable', value: nonReturnableCount },
  ];

  const assetRequestMap = {};

  requests.forEach(req => {
    const name = req.assetName;
    const qty = (req.productQuantity) || 0;

    assetRequestMap[name] =
      (assetRequestMap[name] || 0) + qty;
  });

  const barData = Object.entries(assetRequestMap)
    .map(([assetName, totalQuantity]) => ({
      assetName,
      totalQuantity,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5); // Top 5 requested assets


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        HR Analytics Dashboard
      </h2>

      <div className="stats shadow mb-8">
        <div className="stat">
          <div className="stat-figure text-blue-500 text-3xl">👥</div>
          <div className="stat-title">Total Employees</div>
          <div className="stat-value text-blue-500">
            {employees.length}
          </div>
          <div className="stat-desc">Under your HR</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Returnable vs Non-returnable Assets
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Top Requested Assets (Quantity)
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="assetName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill={COLORS.Bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default HrDashboard;
