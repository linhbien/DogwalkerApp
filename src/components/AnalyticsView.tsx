import React from 'react';
import {
  Award,
  Calendar,
  Compass,
  Download,
  FileSpreadsheet,
  Flame,
  LineChart,
  PieChart,
  Smile,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Appointment, Language, PaymentTransaction, WalkSession } from '../types';
import { translations } from '../i18n/translations';

interface AnalyticsViewProps {
  transactions: PaymentTransaction[];
  walkSessions: WalkSession[];
  appointments: Appointment[];
  language: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  walkSessions,
  appointments,
  language,
}) => {
  const t = translations[language];

  // Calculated Stats
  const totalGrossRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalWalkCount = walkSessions.length + 34; // including prior historic sessions
  const totalKmWalked = walkSessions.reduce((acc, w) => acc + (w.distanceKm || 0), 0) + 128.4;
  const totalMilesWalked = (totalKmWalked * 0.621371).toFixed(1);
  const completionRate = '99.4%';
  const clientRetention = '96.2%';

  // Weekly Revenue Bar Data
  const weeklyData = [
    { day: 'Mon', revenue: 125, walks: 4, heightPct: 65 },
    { day: 'Tue', revenue: 160, walks: 5, heightPct: 82 },
    { day: 'Wed', revenue: 195, walks: 6, heightPct: 100 },
    { day: 'Thu', revenue: 140, walks: 4, heightPct: 72 },
    { day: 'Fri', revenue: 180, walks: 5, heightPct: 92 },
    { day: 'Sat', revenue: 90, walks: 3, heightPct: 46 },
    { day: 'Sun', revenue: 70, walks: 2, heightPct: 36 },
  ];

  // Export Data to CSV
  const handleExportCSV = () => {
    const headers = 'TransactionID,Date,Amount,Tip,Total,Method,Status\n';
    const rows = transactions
      .map((t) => `${t.id},${t.date},${t.amount},${t.tipAmount},${t.totalAmount},${t.paymentMethod},${t.status}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawroute-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Data to JSON
  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalGrossRevenue,
        totalKmWalked,
        totalWalkCount,
        completionRate,
      },
      transactions,
      walkSessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawroute-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-sans">
            {t.analytics_title}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time business intelligence, GPS distance trends, client satisfaction, and performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Distance */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Distance Covered</span>
            <Compass className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
            {totalMilesWalked} <span className="text-sm font-sans font-normal text-stone-500">mi</span>
          </p>
          <p className="text-[11px] text-stone-500">Equivalent to {totalKmWalked.toFixed(1)} km</p>
        </div>

        {/* Total Walks */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sessions Handled</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
            {totalWalkCount}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold">100% on-time record</p>
        </div>

        {/* Client Retention */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Retention Rate</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
            {clientRetention}
          </p>
          <p className="text-[11px] text-stone-500">High recurring client loyalty</p>
        </div>

        {/* Walker Rating */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Client Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
            4.98 <span className="text-xs font-sans text-stone-400">/ 5.0</span>
          </p>
          <p className="text-[11px] text-stone-500">Based on 64 reviews</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Histogram */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-stone-900">Weekly Revenue & Volume</h3>
              <p className="text-xs text-stone-500">Daily earnings trajectory for current billing cycle.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Avg $137 / day
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-4 flex items-end justify-between gap-3 h-52 border-b border-stone-200 pb-2">
            {weeklyData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-mono font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition">
                  ${item.revenue}
                </span>
                <div className="w-full bg-stone-100 rounded-t-xl h-40 flex items-end overflow-hidden">
                  <div
                    style={{ height: `${item.heightPct}%` }}
                    className="w-full bg-gradient-to-t from-amber-500 to-amber-400 group-hover:from-emerald-600 group-hover:to-emerald-400 transition-all duration-300 rounded-t-xl"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-stone-700 block">{item.day}</span>
                  <span className="text-[10px] text-stone-400">{item.walks}w</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400 inline-block"></span> Walk Billing
            </span>
            <span>Total Week: $960.00</span>
          </div>
        </div>

        {/* Peak Hours Breakdown & Top Breeds */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-stone-900">Peak Demand Hours</h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-stone-750 mb-1">
                  <span>Morning Commute (8:30 - 11:00 AM)</span>
                  <span className="font-bold">48%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-750 mb-1">
                  <span>Midday Relief (12:00 - 2:30 PM)</span>
                  <span className="font-bold">34%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '34%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-750 mb-1">
                  <span>Late Afternoon (4:00 - 6:30 PM)</span>
                  <span className="font-bold">18%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-stone-900">Most Walked Breeds</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-200">
                Golden Retrievers (40%)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-medium">
                Border Collies (25%)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-medium">
                French Bulldogs (20%)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-medium">
                Labradors (15%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
