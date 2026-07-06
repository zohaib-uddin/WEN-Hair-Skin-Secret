"use client";

import React from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  Sparkles
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock Data for charts
const revenueData = [
  { date: "Jun 11", revenue: 85000 },
  { date: "Jun 12", revenue: 95000 },
  { date: "Jun 13", revenue: 90000 },
  { date: "Jun 14", revenue: 110000 },
  { date: "Jun 15", revenue: 105000 },
  { date: "Jun 16", revenue: 130000 },
  { date: "Jun 17", revenue: 125000 },
  { date: "Jun 18", revenue: 145000 },
  { date: "Jun 19", revenue: 155000 },
  { date: "Jun 20", revenue: 170000 },
  { date: "Jun 21", revenue: 185000 },
  { date: "Jun 22", revenue: 195000 },
];

const categoryData = [
  { name: "Hair Care", value: 580000, color: "#1F4D3A" }, // Dark Green
  { name: "Skin Care", value: 430000, color: "#C9A227" }, // Gold
  { name: "Body Care", value: 240000, color: "#E8D9BD" }, // Cream Beige (Darker contrast)
];

const recentOrders = [
  { orderId: "WEN-1092", customer: "Amna Khan", date: "Oct 24, 2023", status: "Delivered", total: "Rs. 3,890" },
  { orderId: "WEN-1091", customer: "Zainab Ali", date: "Oct 23, 2023", status: "Processing", total: "Rs. 6,420" },
  { orderId: "WEN-1090", customer: "Hamza Malik", date: "Oct 23, 2023", status: "Shipped", total: "Rs. 2,800" },
  { orderId: "WEN-1089", customer: "Ayesha Omer", date: "Oct 22, 2023", status: "Pending", total: "Rs. 1,299" },
  { orderId: "WEN-1088", customer: "Bilal Farooqi", date: "Oct 21, 2023", status: "Delivered", total: "Rs. 5,150" },
];

export default function AdminDashboardPage() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Processing":
        return "bg-blue-50 text-blue-850 border-blue-200";
      case "Shipped":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1F4D3A] to-[#2E6B52] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#E8D9BD]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse" />
            <span>Wen Botanical Lab Control Room</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold">Good morning, Director Zara</h2>
          <p className="text-xs sm:text-sm text-gray-200 font-sans font-light max-w-xl">
            Here's your current overview of sales, formulations, and order shipments. Keep crafting confidence.
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="Rs. 1,250,000" 
          changeText="+12% from last month" 
          isPositive={true} 
          iconName="DollarSign" 
        />
        <StatCard 
          title="Total Orders" 
          value="450" 
          changeText="+8% from last month" 
          isPositive={true} 
          iconName="ShoppingBag" 
        />
        <StatCard 
          title="Total Customers" 
          value="1,234" 
          changeText="+15% from last month" 
          isPositive={true} 
          iconName="Users" 
        />
        <StatCard 
          title="Low Stock Alerts" 
          value="3 Products" 
          changeText="Needs attention" 
          isPositive={false} 
          iconName="AlertTriangle" 
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Revenue */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">Revenue Overview</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Daily cash inflow curve over the last 30 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-4.5 h-4.5" />
              <span>+18.4% YoY</span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueDashboard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F4D3A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEBE4" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#213D30", border: "none", color: "#F7F2EA", borderRadius: "12px", fontSize: "12px" }}
                  labelStyle={{ fontWeight: "bold", color: "#C9A227" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1F4D3A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenueDashboard)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Sales By Category */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">Sales by Category</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Division of revenues across formulations</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: "#213D30", border: "none", color: "#F7F2EA", borderRadius: "12px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-950">Rs. 1.25M</span>
              <span className="text-[10px] text-gray-400">Invoiced</span>
            </div>
          </div>

          {/* Custom Legends */}
          <div className="flex justify-center items-center gap-4 text-xs font-sans mt-4">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders List Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">Recent Orders</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">The latest luxury shipments ordered by patrons</p>
          </div>
          <Link 
            href="/admin/orders" 
            className="text-[#C9A227] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-left font-sans text-xs">
            <thead>
              <tr className="text-gray-400 uppercase font-semibold">
                <th className="py-3 px-4">Order Record</th>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Fulfilment</th>
                <th className="py-3 px-4 text-right">Invoiced Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#1F4D3A]">
                    {order.orderId}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    {order.customer}
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {order.date}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-gray-950">
                    {order.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
