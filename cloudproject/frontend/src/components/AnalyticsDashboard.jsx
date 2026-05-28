import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Activity, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#1e293b', padding: '10px', border: '1px solid #334155', borderRadius: '8px', color: '#fff', zIndex: 100 }}>
        <p style={{ margin: 0 }}>{`${payload[0].name} : ${payload[0].value || payload[0].payload.count}`}</p>
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = ({ tasks }) => {
  // Calculate Status Data
  const todoCount = tasks.filter(t => t.status === 'To Do').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  const statusData = [
    { name: 'To Do', value: todoCount, color: '#a855f7' },      // Purple
    { name: 'In Progress', value: inProgressCount, color: '#3b82f6' }, // Blue
    { name: 'Done', value: doneCount, color: '#10b981' },       // Green
  ];

  // Calculate Priority Data
  const highCount = tasks.filter(t => t.priority === 'High').length;
  const mediumCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowCount = tasks.filter(t => t.priority === 'Low').length;

  const priorityData = [
    { name: 'High', count: highCount },
    { name: 'Medium', count: mediumCount },
    { name: 'Low', count: lowCount },
  ];

  return (
    <div className="analytics-dashboard fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px', height: '100%', overflowY: 'auto' }}>
      <h2 className="view-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
        <Activity className="inline-icon" color="#38bdf8" /> 
        Project Analytics
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Status Distribution - Pie Chart */}
        <div className="floating-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: '600' }}>
            <PieChartIcon size={20} color="#a855f7" /> Status Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px', color: '#cbd5e1' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown - Bar Chart */}
        <div className="floating-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: '600' }}>
            <BarChart3 size={20} color="#38bdf8" /> Priority Breakdown
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
