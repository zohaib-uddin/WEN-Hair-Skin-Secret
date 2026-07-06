"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  ChevronDown, 
  Eye, 
  RefreshCw, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Settings,
  X
} from "lucide-react";
import { Skeleton } from "../../components/ui/Skeleton";

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

interface Profile {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_address: string;
  city: string;
  phone: string;
  payment_method: string;
  tracking_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
  order_items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState<string>("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders);
      } else {
        console.error("Failed to load orders:", data.error);
      }
    } catch (e) {
      console.error("Error fetching admin orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic Update
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, new_status: newStatus })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to edit status on server");
      }
      
      // Update selected order details view if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (e: any) {
      alert(`Error updating status: ${e.message}`);
      setOrders(previousOrders); // Rollback
    }
  };

  const handleUpdateTracking = async (orderId: string) => {
    setIsUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, tracking_id: trackingInput })
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, tracking_id: trackingInput || null } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, tracking_id: trackingInput || null } : null);
        }
        alert("Tracking ID recorded successfully!");
        setTrackingInput("");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Could not save tracking key");
      }
    } catch (e: any) {
      alert(`Error saving tracking details: ${e.message}`);
    } finally {
      setIsUpdatingId(null);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-widest font-sans">Pending</span>;
      case "processing":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-widest font-sans">Processing</span>;
      case "shipped":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-widest font-sans font-sans">Shipped</span>;
      case "delivered":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest font-sans">Delivered</span>;
      case "cancelled":
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-widest font-sans">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-50 text-gray-700 border border-gray-100 uppercase tracking-widest font-sans">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (o.profiles?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.phone.includes(searchQuery);

    const matchesFilter = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FCFBEE]/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Luxury Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200/60">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">Order Fulfilment</h1>
            <p className="text-sm font-sans text-gray-500 mt-1">Manage luxury hair-skin formulations and shipping logistics.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-xl hover:bg-white text-gray-650 font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        {/* Filters and Utilities Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input 
              type="text" 
              placeholder="Search by Order #, Customer or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C9A227] font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-500 mr-2">Status:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-sans font-medium focus:outline-none focus:border-[#C9A227]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Loading Skeleton vs Table */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-playfair font-bold text-gray-900">No Orders Registered</h3>
            <p className="text-sm font-sans text-gray-500 mt-1">There are no orders matching your selected filter guidelines.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Order #</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Customer</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Phone</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Placed At</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans font-sans">Total (Rs.)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Status</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-150/60">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/55 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1F4D3A] font-sans">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-950 font-sans">
                        {order.profiles?.name || "Premium Guest"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-sans">
                        {order.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-sans">
                        {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 font-sans">
                        Rs. {Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-3">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-sans focus:outline-none focus:border-[#C9A227]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setTrackingInput(order.tracking_id || "");
                            }}
                            className="p-1 px-2.5 text-xs text-[#1F4D3A] bg-[#1F4D3A]/5 hover:bg-[#1F4D3A]/10 rounded-lg font-medium tracking-wide flex items-center gap-1 transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gray-100 shadow-2xl p-6 md:p-8 relative">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute right-6 top-6 p-1 bg-gray-50 hover:bg-gray-150 text-gray-400 hover:text-gray-600 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#C9A227]">Transaction Record</span>
                <h2 className="text-2xl font-playfair font-bold text-gray-900 mt-1">Order {selectedOrder.order_number}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedOrder.status)}
                  <span className="text-xs text-gray-400 font-sans">• Placed: {new Date(selectedOrder.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Grid Breakdown details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 font-sans">Customer Specs</h4>
                  <p className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {selectedOrder.profiles?.name || "Premium Guest"}</p>
                  <p className="text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {selectedOrder.phone}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 font-sans">Email: {selectedOrder.profiles?.email || "No email available"}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 font-sans">Shipping Specs</h4>
                  <p className="text-sm flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> <span>{selectedOrder.shipping_address}, {selectedOrder.city}</span></p>
                  <p className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /> <span>Method: <strong className="uppercase">{selectedOrder.payment_method}</strong></span></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-6 border-b border-gray-100">
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 font-sans mb-4">Elixir Composition</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 justify-between bg-gray-50 p-3 rounded-xl border border-gray-100/60">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                          {item.products?.images?.[0] ? (
                            <img src={item.products.images[0]} alt={item.products.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.products?.name || "Secret formulation"}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} x Rs. {Number(item.price).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900 font-sans">Rs. {Number(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <p className="text-md font-sans text-gray-800">
                    Grand Total: <strong className="text-xl font-playfair text-[#1F4D3A] ml-2">Rs. {Number(selectedOrder.total_amount).toLocaleString()}</strong>
                  </p>
                </div>
              </div>

              {/* Notes Context */}
              {selectedOrder.notes && (
                <div className="py-4 border-b border-gray-100 text-sm text-gray-600 bg-amber-50/45 p-3 rounded-lg mt-4 border border-amber-100/30">
                  <strong>Customer Instructions:</strong> {selectedOrder.notes}
                </div>
              )}

              {/* Royal Tracking ID Update Box */}
              <div className="pt-6">
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-gray-500 mb-2">Assign Shipping Logistics Tracking ID:</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. TCS-7981263, LEP-47812"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-sans font-medium"
                  />
                  <button 
                    disabled={isUpdatingId === selectedOrder.id}
                    onClick={() => handleUpdateTracking(selectedOrder.id)}
                    className="px-4 py-2 bg-[#1F4D3A] hover:bg-[#153427] disabled:bg-gray-200 text-white font-sans text-xs uppercase tracking-widest font-bold rounded-xl transition flex items-center gap-1"
                  >
                    {isUpdatingId === selectedOrder.id ? "Saving..." : "Apply"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
