import React from "react";
import { Eye, Search, Filter, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

interface OrderHistoryTabProps {
  orders: any[];
  loadingOrders: boolean;
  onViewOrder: (order: any) => void;
  onNavigateShop: () => void;
}

export const OrderHistoryTab: React.FC<OrderHistoryTabProps> = ({
  orders,
  loadingOrders,
  onViewOrder,
  onNavigateShop,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-[16px] md:space-y-[24px] font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] md:gap-[16px]">
        <h2 className="font-playfair text-[24px] md:text-[32px] font-bold text-[#1F4D3A]">
          Order History
        </h2>
        {/* We can add a simple mock filter/search here for UI completeness */}
        <div className="flex items-center gap-[8px] md:gap-[12px] w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-[16px] md:w-[18px] h-[16px] md:h-[18px] text-[#6b6b6b] absolute left-[12px] top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full sm:w-auto pl-[32px] md:pl-[36px] pr-[12px] md:pr-[16px] py-[8px] md:py-[10px] rounded-lg md:rounded-xl border-2 border-[#e5e5e5] focus:border-[#C9A227] outline-none text-[13px] md:text-[14px]"
            />
          </div>
          <button className="p-[8px] md:p-[10px] rounded-lg md:rounded-xl border-2 border-[#e5e5e5] text-[#6b6b6b] hover:border-[#1F4D3A] transition-colors cursor-pointer shrink-0">
            <Filter className="w-[16px] md:w-[18px] h-[16px] md:h-[18px]" />
          </button>
        </div>
      </div>

      {loadingOrders ? (
        <div className="py-[40px] md:py-[60px] text-center bg-white rounded-[16px] md:rounded-[20px] border-2 border-[#e5e5e5]">
          <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] rounded-full border-4 border-[#1F4D3A] border-t-transparent animate-spin mx-auto mb-[12px] md:mb-[16px]"></div>
          <p className="text-[13px] md:text-[14px] text-[#6b6b6b]">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-[60px] md:py-[80px] text-center bg-white rounded-[16px] md:rounded-[20px] border-2 border-dashed border-[#e5e5e5] px-[16px]">
          <div className="w-[48px] md:w-[64px] h-[48px] md:h-[64px] bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-[16px] md:mb-[24px]">
            <ShoppingBag className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] text-[#6b6b6b]" />
          </div>
          <h3 className="font-playfair text-[20px] md:text-[24px] font-bold text-[#1a1a1a] mb-[8px]">
            No Orders Yet
          </h3>
          <p className="text-[14px] md:text-[15px] text-[#6b6b6b] mb-[16px] md:mb-[24px]">
            You haven't placed any orders yet. Start exploring our collection!
          </p>
          <button
            onClick={onNavigateShop}
            className="px-[20px] md:px-[24px] py-[10px] md:py-[12px] bg-[#0a0a0a] hover:bg-[#1F4D3A] text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider rounded-lg md:rounded-xl transition-colors cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-[12px] md:space-y-[16px]">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white p-[16px] md:p-[24px] rounded-[16px] md:rounded-[20px] border-2 border-[#e5e5e5] flex flex-col sm:flex-row justify-between sm:items-center gap-[16px] md:gap-[24px] shadow-sm hover:border-[#C9A227] transition-all"
            >
              <div className="space-y-[6px] md:space-y-[8px]">
                <div className="flex flex-wrap items-center gap-[8px] md:gap-[12px]">
                  <span className="font-bold text-[15px] md:text-[16px] text-[#1a1a1a]">
                    Order #{order.orderId}
                  </span>
                  <span
                    className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider px-[10px] md:px-[12px] py-[3px] md:py-[4px] rounded-full ${
                      order.status === "Delivered"
                        ? "bg-[#10b981]/10 text-[#10b981]"
                        : order.status === "Processing"
                        ? "bg-[#C9A227]/10 text-[#C9A227]"
                        : "bg-gray-100 text-[#6b6b6b]"
                    }`}
                  >
                    {order.status || "Processing"}
                  </span>
                </div>
                <p className="text-[13px] md:text-[14px] text-[#6b6b6b]">
                  Placed on {order.date}
                </p>
                <div className="text-[13px] md:text-[14px] text-[#1a1a1a] font-medium max-w-full sm:max-w-md truncate line-clamp-1 sm:line-clamp-none">
                  {order.items?.map((it: any) => `${it.quantity}x ${it.name}`).join(", ")}
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-[12px] mt-[8px] sm:mt-0 border-t sm:border-t-0 border-[#e5e5e5] pt-[12px] sm:pt-0">
                <span className="font-playfair text-[18px] md:text-[20px] font-bold text-[#1F4D3A]">
                  Rs. {(Number(order.totalPrice) || 0).toLocaleString()}
                </span>
                <button
                  onClick={() => onViewOrder(order)}
                  className="px-[14px] md:px-[16px] py-[8px] md:py-[10px] bg-white border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] text-[12px] md:text-[13px] font-bold uppercase tracking-wider rounded-lg md:rounded-xl transition-colors cursor-pointer flex items-center gap-[6px] md:gap-[8px]"
                >
                  <Eye className="w-[14px] md:w-[16px] h-[14px] md:h-[16px]" /> View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
