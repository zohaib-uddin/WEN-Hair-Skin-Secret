"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Percent, 
  Calendar, 
  ChevronDown, 
  RefreshCw,
  Search,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock Data
const revenueTrend = [
  { name: "Week 1", currentYr: 280000, lastYr: 240000 },
  { name: "Week 2", currentYr: 310000, lastYr: 290000 },
  { name: "Week 3", currentYr: 350000, lastYr: 310000 },
  { name: "Week 4", currentYr: 420000, lastYr: 330000 },
];

const topProducts = [
  { name: "Saffron Youth Serum", sales: 245 },
  { name: "Onion Blackseed Elixir", sales: 189 },
  { name: "Pure Sandalwood Butter", sales: 142 },
  { name: "Clinical Serum Gel", sales: 98 },
  { name: "Acne Deep wash", sales: 86 },
];

const trafficSources = [
  { name: "WhatsApp Chat", value: 65, color: "#1F4D3A" },
  { name: "Instagram DM", value: 20, color: "#C9A227" },
  { name: "Direct Search", value: 15, color: "#ECEBE4" },
];

const customerGrowth = [
  { month: "Jan", members: 450 },
  { month: "Feb", members: 580 },
  { month: "Mar", members: 710 },
  { month: "Apr", members: 920 },
  { month: "May", members: 1100 },
  { month: "Jun", members: 1234 },
];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* Header with Date select filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#1F4D3A] tracking-wide uppercase">Biomorphic Analytics</h2>
          <p className="text-xs text-gray-400 font-sans font-light mt-0.5 font-sans">Gauge formulation sales performance and customer trends.</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-sans">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-gray-200 focus:outline-none focus:border-[#C9A227] px-4 py-3 rounded-xl font-semibold pr-8 appearance-none cursor-pointer"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="This Year">This Year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleRefresh}
            className={`p-3 bg-white border border-gray-200 text-gray-500 hover:text-black rounded-xl transition cursor-pointer flex items-center justify-center ${loading ? "animate-spin" : ""}`}
            aria-label="Refresh analysis parameters"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Primary Key Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between select-none">
            <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase">Gross Revenue</span>
            <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold px-2 py-1 rounded-full">+12.4%</span>
          </div>
          <div className="pt-2">
            <p className="text-xl font-bold text-gray-900 font-sans">Rs. 1,250,000</p>
            <p className="text-[10px] text-gray-400 font-sans mt-1">PKR gross inflows cleared</p>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between select-none">
            <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase">AOV</span>
            <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold px-2 py-1 rounded-full">+4.2%</span>
          </div>
          <div className="pt-2">
            <p className="text-xl font-bold text-gray-900 font-sans">Rs. 2,778</p>
            <p className="text-[10px] text-gray-400 font-sans mt-1">Average Order Value per checkout</p>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between select-none">
            <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase">Active Orders</span>
            <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold px-2 py-1 rounded-full">+8%</span>
          </div>
          <div className="pt-2">
            <p className="text-xl font-bold text-gray-900 font-sans">450 Requests</p>
            <p className="text-[10px] text-gray-400 font-sans mt-1">Orders cleared this term</p>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between select-none">
            <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase">Conversion Rate</span>
            <span className="text-rose-600 bg-rose-50 text-[10px] font-bold px-2 py-1 rounded-full">-0.4%</span>
          </div>
          <div className="pt-2">
            <p className="text-xl font-bold text-gray-900 font-sans">3.42 %</p>
            <p className="text-[10px] text-gray-400 font-sans mt-1">Total click-to-cart ratio</p>
          </div>
        </div>
      </div>

      {/* Grid: Trends Line Graph + Top Products Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Linechart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">Weekly Sales Trend</h3>
            <p className="text-[10px] text-gray-450 mt-0.5">Clearing performance with YoY benchmark reference</p>
          </div>

          <div className="h-64 w-full pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colYrCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F4D3A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1F4D3A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colYrLast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEBE4" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#213D30", border: "none", color: "#F7F2EA", borderRadius: "12px", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="currentYr" name="This Year (Rs)" stroke="#1F4D3A" strokeWidth={2.5} fillOpacity={1} fill="url(#colYrCurrent)" />
                <Area type="monotone" dataKey="lastYr" name="Last Year (Rs)" stroke="#C9A227" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colYrLast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Product Bar chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">Top Products (Qty)</h3>
            <p className="text-[10px] text-gray-450 mt-0.5">Best performing treatment units</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 5, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ECEBE4" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={9} width={75} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#213D30", border: "none", color: "#F7F2EA", borderRadius: "10px", fontSize: "10px" }}
                />
                <Bar dataKey="sales" name="Units Sold" fill="#1F4D3A" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Traffic Sources + Customer Growth Area Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Growth Area plot */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">Customer Base Growth</h3>
            <p className="text-[10px] text-gray-450 mt-0.5">Growth curve of registered shoppers</p>
          </div>

          <div className="h-64 w-full pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCustomerGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEBE4" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#213D30", border: "none", color: "#F7F2EA", borderRadius: "12px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="members" name="Registered Patrons" stroke="#C9A227" strokeWidth={2} fillOpacity={1} fill="url(#colorCustomerGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Pie */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">Checkout Channels</h3>
            <p className="text-[10px] text-gray-450 mt-0.5">Preferred digital touchpoints for placing secret orders</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ backgroundColor: "#213D30", border: "none", color: "#F7F2EA", borderRadius: "12px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-gray-900">65%</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">WhatsApp</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 font-sans text-xs pt-4 border-t border-gray-50">
            {trafficSources.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-500 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
