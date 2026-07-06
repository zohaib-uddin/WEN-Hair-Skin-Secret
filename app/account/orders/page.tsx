"use client";

import React, { useState, useEffect } from "react";
import { Package, Calendar, Award, ExternalLink, RefreshCw, Eye } from "lucide-react";
import { Skeleton } from "../../components/ui/Skeleton";
import { useShop } from "../../../src/context/ShopContext";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product_id: string;
  products: Product | null;
}

interface Order {
  id: string;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
}

export default function AccountOrdersPage() {
  const { user, profile } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    const clerkId = profile?.clerk_id || user?.id;
    if (!clerkId) {
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
        console.error("Failed to load user orders:", data.error);
      }
    } catch (e) {
      console.error("Error loading user orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user || profile) {
      fetchOrders();
    }
  }, [user, profile]);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-250 uppercase tracking-widest font-sans font-medium">Pending</span>;
      case "processing":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-750 border border-blue-200 uppercase tracking-widest font-sans font-medium font-sans">Processing</span>;
      case "shipped":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-widest font-sans font-medium">Shipped</span>;
      case "delivered":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250 uppercase tracking-widest font-sans font-medium">Delivered</span>;
      case "cancelled":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-widest font-sans font-medium">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-50 text-gray-700 border border-gray-100 uppercase tracking-widest font-sans font-medium">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBEE]/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Luxury Banner */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 mb-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-sans font-black uppercase tracking-widest text-[#C9A227]">Royal Account</span>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 mt-2">Your Order Journal</h1>
            <p className="text-sm font-sans text-gray-500 mt-1">Review active shipments, botanical formulation deliveries, and historical accounts.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="self-start md:self-center px-4 py-2 bg-[#1F4D3A]/5 hover:bg-[#1F4D3A]/10 rounded-xl transition text-xs font-bold uppercase text-[#1F4D3A] tracking-wider font-sans flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload History
          </button>
        </div>

        {/* Orders Layout list */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-playfair font-bold text-gray-900">Your formulation log is empty</h3>
            <p className="text-sm font-sans text-gray-500 mt-2 mb-6">You have not ordered from Wen Hair & Skin Secret yet.</p>
            <a 
              href="/shop"
              className="px-6 py-3 bg-[#1F4D3A] hover:bg-[#153427] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-md hover:shadow-lg inline-block"
            >
              Examine the Catalog
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Order #</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Purchased Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans font-sans">Total Amount</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Logistics</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1F4D3A] font-sans">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-sans">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-950 font-sans">
                        Rs. {Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <a 
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1F4D3A]/5 hover:bg-[#1F4D3A]/10 rounded-lg text-[#1F4D3A] font-sans text-xs font-bold uppercase tracking-widest transition"
                        >
                          <span>Track Order</span>
                          <Eye className="w-3 h-3" />
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
