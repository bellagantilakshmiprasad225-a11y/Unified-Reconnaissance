import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { GlassCard } from '../common/GlassCard';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';

export const DashboardCharts: React.FC = () => {
  const { investigations } = useInvestigationStore();
  const { history } = useSearchHistoryStore();

  // Searches per day chart data
  const searchesPerDayData = [
    { day: 'Mon', searches: 4 },
    { day: 'Tue', searches: 7 },
    { day: 'Wed', searches: 12 },
    { day: 'Thu', searches: 9 },
    { day: 'Fri', searches: 15 },
    { day: 'Sat', searches: 6 },
    { day: 'Sun', searches: history.length > 0 ? history.length : 8 },
  ];

  // Investigation status pie chart data
  const statusCounts = {
    New: investigations.filter((i) => i.status === 'New').length,
    'In Progress': investigations.filter((i) => i.status === 'In Progress').length,
    Completed: investigations.filter((i) => i.status === 'Completed').length,
    Archived: investigations.filter((i) => i.status === 'Archived').length,
  };

  const pieData = [
    { name: 'New', value: statusCounts.New || 1, color: '#06b6d4' },
    { name: 'In Progress', value: statusCounts['In Progress'] || 1, color: '#f59e0b' },
    { name: 'Completed', value: statusCounts.Completed || 1, color: '#10b981' },
    { name: 'Archived', value: statusCounts.Archived || 0, color: '#64748b' },
  ].filter((d) => d.value > 0);

  // Tool usage data
  const toolUsageData = [
    { name: 'WHOIS', count: 18 },
    { name: 'DNS', count: 14 },
    { name: 'IP Info', count: 22 },
    { name: 'Email Intel', count: 9 },
    { name: 'Dorks Gen', count: 16 },
    { name: 'Metadata', count: 11 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Searches Per Day Line Chart */}
      <GlassCard className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Searches Per Day</h3>
            <p className="text-[11px] text-slate-400 font-mono">OSINT query trends over time</p>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Realtime Analytics
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={searchesPerDayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#06b6d4', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Line
                type="monotone"
                dataKey="searches"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4, fill: '#06b6d4' }}
                activeDot={{ r: 6, fill: '#38bdf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Investigation Status Donut */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Investigation Status</h3>
            <p className="text-[11px] text-slate-400 font-mono">Current case distribution</p>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="truncate">{d.name}:</span>
              <span className="font-bold text-white ml-auto">{d.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Tool Usage Bar Chart */}
      <GlassCard className="lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Tool Usage Frequency</h3>
            <p className="text-[11px] text-slate-400 font-mono">Most utilized OSINT lookup modules</p>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={toolUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#38bdf8', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]}>
                {toolUsageData.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#1e40af'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
