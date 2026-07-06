"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "../../src/context/ShopContext";
import { ShoppingBag, Heart, MapPin, Eye, Calendar, Award } from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: any[];
}

export default function AccountDashboardPage() {
  const { wishlist, navigate, user, profile } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("Sarah Ahmed Malik");

  useEffect(() => {
    if (user || profile) {
      const uName = profile?.full_name || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Valued Patron");
      setUserName(uName);
    }
  }, [user, profile]);

  useEffect(() => {
    const fetchOrders = async () => {
      const clerkId = profile?.clerk_id || user?.id;
      if (!clerkId) {
        // Keep loading true until auth loads or set false if no auth
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/user/orders?clerk_id=${clerkId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(data.orders || []);
        } else {
          throw new Error(data.error || "Failed live fetch");
        }
      } catch (err) {
        console.warn("Failed to retrieve live user orders, using state/localStorage", err);
        // Fallback demo orders matching mock
        const raw = localStorage.getItem("wen_order_tracking_db");
        const stored = raw ? JSON.parse(raw) : {};
        const storedList = Object.values(stored) as Order[];
        
        const demoOrders: Order[] = [
          {
            id: "wen-order-1",
            order_number: "WEN-958432",
            status: "delivered",
            total_amount: 6400,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            order_items: [
              { quantity: 1, price: 4200 },
              { quantity: 1, price: 2200 }
            ]
          }
        ];
        setOrders(storedList.length > 0 ? [...storedList, ...demoOrders] : demoOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, profile]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "pending":
        return <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-50 text-amber-600 border border-amber-200">Pending</span>;
      case "processing":
        return <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-blue-50 text-blue-600 border border-blue-200">Processing</span>;
      case "shipped":
        return <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">Shipped</span>;
      case "delivered":
        return <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Delivered</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-rose-50 text-rose-600 border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-gray-50 text-gray-600 border border-gray-150">{status}</span>;
    }
  };

  return (
    <div className="space-y-10 text-left font-sans animate-fade-in" id="account-dashboard-overview">
      {/* Welcome Header */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A227] uppercase font-bold block mb-2">
          Sanctum Cleared
        </span>
        <h1 className="font-playfair text-3xl font-extrabold text-[#1F4D3A] tracking-wide">
          Hello, {userName.split(" ")[0]}!
        </h1>
        <p className="text-xs text-gray-500 font-light mt-2 max-w-2xl leading-relaxed">
          From your account dashboard you can easily view your recent orders and formulation logs, 
          manage your custom shipping and billing targets, and edit your private pass-key credentials.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex items-center gap-4 hover:border-[#1F4D3A]/20 transition-all group">
          <div className="w-12 h-12 bg-[#C9A227]/10 text-[#C9A227] rounded-full flex items-center justify-center transition-all group-hover:scale-105">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">Total Orders</span>
            <span className="text-2xl font-bold text-[#1F4D3A]">{orders.length} Batch</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex items-center gap-4 hover:border-[#1F4D3A]/20 transition-all group">
          <div className="w-12 h-12 bg-[#C9A227]/10 text-[#C9A227] rounded-full flex items-center justify-center transition-all group-hover:scale-105">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">Saved Secrets</span>
            <span className="text-2xl font-bold text-[#1F4D3A]">{wishlist.length} Items</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex items-center gap-4 hover:border-[#1F4D3A]/20 transition-all group">
          <div className="w-12 h-12 bg-[#C9A227]/10 text-[#C9A227] rounded-full flex items-center justify-center transition-all group-hover:scale-105">
            <MapPin className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">Addresses</span>
            <span className="text-2xl font-bold text-[#1F4D3A]">2 Locations</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-xl font-bold text-[#1F4D3A] uppercase tracking-wider">
            Recent Batches
          </h2>
          <button
            onClick={() => {
              // SPA navigate fallback or browser routing
              const el = document.getElementById("account-nav-orders");
              if (el) el.click();
            }}
            className="text-[#C9A227] hover:text-[#1F4D3A] text-xs font-bold uppercase tracking-wider hover:underline"
          >
            View Full Ledger
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl animate-pulse" />
            <Skeleton className="h-16 w-full rounded-xl animate-pulse" />
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 font-sans text-xs">
            No apothecary transactions registered.
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-[#F7F2EA]/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Order #</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date Logged</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Paid</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {orders.slice(0, 2).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold font-mono text-[#1F4D3A]">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-900">
                        Rs. {Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <a
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-[#1F4D3A]/5 hover:bg-[#1F4D3A]/10 text-[#1F4D3A] rounded-xl transition-all"
                        >
                          <span>Track</span>
                          <Eye className="w-3 h-3 text-[#1F4D3A]" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
