import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { Package, Search, CheckCircle, Clock, ShieldAlert, ChevronRight, Lock, Eye, Printer, ArrowLeft } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "motion/react";

export const TrackOrderPage: React.FC = () => {
  const { navigate, triggerToast, authLoading, user, profile } = useShop();
  const { isLoaded, userId } = useAuth();
  const [orderQuery, setOrderQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const loggedIn = !!userId || !!user;
  const activeClerkId = userId || user?.id || profile?.clerk_id;

  // Fetch user's actual orders if they are logged in
  useEffect(() => {
    if (activeClerkId) {
      setLoadingOrders(true);
      fetch(`/api/user/orders?clerk_id=${activeClerkId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.orders) {
            setUserOrders(data.orders);
          }
        })
        .catch((err) => console.error("Error fetching user orders:", err))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeClerkId]);

  if (!isLoaded || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F2EA]">
        <div className="w-[40px] h-[40px] border-4 border-[#1F4D3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    if (!loggedIn) {
      setErrorMsg("Please sign in to track your order.");
      triggerToast("You must be signed in to track orders.");
      return;
    }

    await triggerTrackOrder(orderQuery.trim());
  };

  const triggerTrackOrder = async (queryStr: string) => {
    setIsLoading(true);
    setSearched(false);
    setErrorMsg("");
    setTrackResult(null);

    try {
      const query = queryStr.toUpperCase();
      setOrderQuery(query);

      // Make a call to our secure backend tracking endpoint
      const res = await fetch(`/api/track-order?query=${encodeURIComponent(query)}&clerk_id=${activeClerkId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTrackResult(data.trackResult);
      } else {
        setErrorMsg(data.error || "No active order found with that tracking query.");
      }
    } catch (err: any) {
      console.error("Tracking API call exception:", err);
      setErrorMsg("Failed to communicate with secure tracking registry. Please try again.");
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };

  const stages = [
    { title: "Order Placed", desc: "Your dispatch request was logged inside our database.", code: "Placed" },
    { title: "Processing", desc: "Freshly checked and sealed at our facilities.", code: "Processing" },
    { title: "Shipped", desc: "Consigned to courier services. En route to your destination.", code: "Shipped" },
    { title: "Out for Delivery", desc: "Your package is with our local rider and will be delivered today.", code: "OutForDelivery" },
    { title: "Delivered", desc: "Safely received on your doorstep.", code: "Delivered" },
  ];

  const getStageStatus = (stageCode: string, currentStatus: string) => {
    const statusSequence = ["Placed", "Processing", "Shipped", "OutForDelivery", "Delivered"];
    const targetIdx = statusSequence.indexOf(stageCode);
    const currentIdx = statusSequence.indexOf(currentStatus);

    if (targetIdx < currentIdx) return "completed";
    if (targetIdx === currentIdx) return "active";
    return "upcoming";
  };

  return (
    <div className="bg-[#F7F2EA] min-h-screen pt-[120px] pb-[80px] font-sans">
      <div className="max-w-[1200px] mx-auto px-[24px]">
        
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-[60px]">
          <span className="text-[#C9A227] text-[10px] font-bold tracking-[0.3em] uppercase block mb-[16px]">
            Secure Courier Integration
          </span>
          <h1 className="font-playfair text-[40px] md:text-[56px] font-bold text-[#1F4D3A] tracking-wide mb-[24px]">
            Track Order
          </h1>
          <p className="text-[14px] text-[#6b6b6b] font-light leading-relaxed">
            Check the real-time status of your order. For security and privacy, you must be signed in to track your orders.
          </p>
        </div>

        {!loggedIn ? (
          <div className="max-w-[500px] mx-auto bg-white border border-[#e5e5e5] rounded-[24px] md:rounded-[32px] p-[24px] md:p-[40px] text-center shadow-sm">
            <div className="w-[48px] md:w-[64px] h-[48px] md:h-[64px] bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto text-[#1F4D3A] mb-[16px] md:mb-[24px]">
              <Lock className="w-[20px] md:w-[24px] h-[20px] md:h-[24px]" />
            </div>
            <h3 className="font-playfair text-[20px] md:text-[24px] font-bold text-[#1a1a1a] mb-[8px] md:mb-[12px]">Sign In Required</h3>
            <p className="text-[13px] md:text-[14px] text-[#6b6b6b] leading-relaxed font-light mb-[24px] md:mb-[32px]">
              Order details are protected by cryptographic account security. Please sign in to verify status updates of your transactions.
            </p>
            <button
              onClick={() => navigate("sign-in")}
              className="w-full py-[14px] md:py-[16px] bg-[#1F4D3A] hover:bg-[#C9A227] text-white text-[12px] font-bold uppercase tracking-widest transition-colors rounded-full"
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-[24px] md:gap-[40px]">
            
            {/* Left Column: Search & Recent */}
            <div className="w-full lg:w-[400px] shrink-0 space-y-[24px] md:space-y-[32px]">
              <div className="bg-white border border-[#e5e5e5] rounded-[24px] md:rounded-[32px] p-[20px] md:p-[32px] shadow-sm">
                <h3 className="font-playfair text-[18px] md:text-[20px] font-bold text-[#1a1a1a] mb-[16px] md:mb-[24px]">
                  Search Order
                </h3>
                <form onSubmit={handleTrackSubmit} className="space-y-[12px] md:space-y-[16px]">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="e.g. WEN-102938"
                      className="w-full pl-[40px] md:pl-[48px] pr-[12px] md:pr-[16px] py-[12px] md:py-[16px] bg-[#f5f5f5] border border-transparent focus:border-[#C9A227] focus:bg-white rounded-xl text-[13px] md:text-[14px] outline-none transition-all"
                    />
                    <Package className="w-[18px] md:w-[20px] h-[18px] md:h-[20px] text-[#6b6b6b] absolute left-[12px] md:left-[16px] top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1F4D3A] hover:bg-[#C9A227] text-white text-[11px] md:text-[12px] font-bold px-[20px] md:px-[24px] py-[12px] md:py-[16px] rounded-xl uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-[6px] md:gap-[8px]"
                  >
                    {isLoading ? (
                      <div className="w-[14px] md:w-[16px] h-[14px] md:h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="w-[14px] md:w-[16px] h-[14px] md:h-[16px]" />
                    )}
                    <span>{isLoading ? "Searching..." : "Track Package"}</span>
                  </button>
                </form>
              </div>

              {userOrders.length > 0 && (
                <div className="bg-white border border-[#e5e5e5] rounded-[24px] md:rounded-[32px] p-[20px] md:p-[32px] shadow-sm">
                  <h3 className="font-playfair text-[18px] md:text-[20px] font-bold text-[#1a1a1a] mb-[16px] md:mb-[24px]">
                    Recent Orders
                  </h3>
                  <div className="space-y-[12px] md:space-y-[16px]">
                    {userOrders.slice(0, 3).map((order: any) => (
                      <div key={order.id} className="p-[12px] md:p-[16px] border border-[#e5e5e5] rounded-xl hover:border-[#1F4D3A] transition-colors group cursor-pointer" onClick={() => triggerTrackOrder(order.order_number)}>
                        <div className="flex justify-between items-center mb-[4px] md:mb-[8px]">
                          <span className="font-mono text-[13px] md:text-[14px] font-bold text-[#1F4D3A]">{order.order_number}</span>
                          <ChevronRight className="w-[14px] md:w-[16px] h-[14px] md:h-[16px] text-[#6b6b6b] group-hover:text-[#1F4D3A] transition-colors" />
                        </div>
                        <p className="text-[11px] md:text-[12px] text-[#6b6b6b]">
                          {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Tracking Results */}
            <div className="w-full flex-1">
              {searched && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={orderQuery}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#e5e5e5] rounded-[24px] md:rounded-[32px] p-[24px] md:p-[48px] shadow-sm min-h-[400px] md:min-h-[500px]"
                  >
                    {trackResult ? (
                      <div>
                        {/* Status Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] md:gap-[24px] mb-[24px] md:mb-[40px] pb-[24px] md:pb-[32px] border-b border-[#e5e5e5]">
                          <div>
                            <span className="text-[11px] md:text-[12px] font-bold text-[#6b6b6b] uppercase tracking-wider block mb-[4px] md:mb-[8px]">
                              Order #{trackResult.orderId}
                            </span>
                            <h2 className="font-playfair text-[24px] md:text-[32px] font-bold text-[#1F4D3A]">
                              {trackResult.status === "Delivered" ? "Successfully Delivered" : "In Transit"}
                            </h2>
                            <p className="text-[13px] md:text-[14px] text-[#6b6b6b] mt-[4px] md:mt-[8px]">
                              Estimated Delivery: <strong className="text-[#1a1a1a]">{trackResult.estimatedDelivery}</strong>
                            </p>
                          </div>
                          <div className="bg-[#f5f5f5] p-[12px] md:p-[16px] rounded-xl text-[11px] md:text-[12px]">
                            <p className="text-[#6b6b6b] mb-[2px] md:mb-[4px]">Shipping to:</p>
                            <p className="font-bold text-[#1a1a1a]">{trackResult.fullName}</p>
                            <p className="text-[#6b6b6b]">{trackResult.address}</p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-[24px] md:pl-[40px] py-[16px] md:py-[24px]">
                          <div className="absolute left-[35px] md:left-[51px] top-[24px] md:top-[40px] bottom-[24px] md:bottom-[40px] w-[2px] bg-[#f5f5f5]" />
                          
                          <div className="space-y-[32px] md:space-y-[48px]">
                            {stages.map((stage, idx) => {
                              const status = getStageStatus(stage.code, trackResult.status);
                              return (
                                <div key={idx} className="relative flex items-start gap-[16px] md:gap-[24px]">
                                  <div className="relative z-10 w-[24px] h-[24px] mt-[2px] shrink-0">
                                    {status === "completed" ? (
                                      <div className="w-full h-full rounded-full bg-[#1F4D3A] flex items-center justify-center">
                                        <CheckCircle className="w-[12px] h-[12px] text-white" />
                                      </div>
                                    ) : status === "active" ? (
                                      <div className="w-full h-full rounded-full border-[4px] border-[#C9A227] bg-white shadow-[0_0_0_4px_rgba(201,162,39,0.1)]" />
                                    ) : (
                                      <div className="w-full h-full rounded-full border-2 border-[#e5e5e5] bg-white" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className={`text-[15px] md:text-[16px] font-bold mb-[2px] md:mb-[4px] ${
                                      status === "completed" ? "text-[#1a1a1a]" : status === "active" ? "text-[#C9A227]" : "text-[#6b6b6b]"
                                    }`}>
                                      {stage.title}
                                    </h4>
                                    <p className="text-[13px] md:text-[14px] text-[#6b6b6b] font-light max-w-[400px]">
                                      {stage.desc}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-[60px] md:py-[80px]">
                        <div className="w-[64px] md:w-[80px] h-[64px] md:h-[80px] bg-[#f5f5f5] rounded-full flex items-center justify-center mb-[16px] md:mb-[24px]">
                          <ShieldAlert className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] text-[#C9A227]" />
                        </div>
                        <h3 className="font-playfair text-[20px] md:text-[24px] font-bold text-[#1a1a1a] mb-[8px] md:mb-[12px]">
                          Order Not Found
                        </h3>
                        <p className="text-[13px] md:text-[14px] text-[#6b6b6b] max-w-[400px]">
                          {errorMsg || "We couldn't find an order matching that ID. Please check your spelling and try again."}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
              
              {!searched && (
                <div className="bg-white/50 border border-[#e5e5e5] rounded-[24px] md:rounded-[32px] h-full min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center text-center p-[24px] md:p-[40px]">
                  <div className="w-[64px] md:w-[80px] h-[64px] md:h-[80px] bg-white rounded-full flex items-center justify-center shadow-sm mb-[16px] md:mb-[24px]">
                    <Package className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] text-[#c9a227]" />
                  </div>
                  <h3 className="font-playfair text-[20px] md:text-[24px] font-bold text-[#1a1a1a] mb-[8px] md:mb-[12px]">
                    Track Your Package
                  </h3>
                  <p className="text-[13px] md:text-[14px] text-[#6b6b6b] max-w-[300px]">
                    Enter your Order ID in the search box to view real-time delivery updates.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default TrackOrderPage;
