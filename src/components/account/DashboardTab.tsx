import React from "react";
import { ShoppingBag, Heart, CreditCard, ChevronRight, Eye } from "lucide-react";
import { motion } from "motion/react";

interface DashboardTabProps {
  userName: string;
  orders: any[];
  wishlistCount: number;
  onNavigateTab: (tab: string) => void;
  onViewOrder: (order: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  userName,
  orders,
  wishlistCount,
  onNavigateTab,
  onViewOrder,
}) => {
  const totalSpent = orders.reduce(
    (acc, o) => acc + (Number(o.totalPrice) || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-[24px] md:space-y-[32px] font-sans"
    >
      {/* Top Greeting */}
      <div>
        <h2 className="font-playfair text-[24px] md:text-[32px] font-bold text-[#254936] mb-[4px] md:mb-[8px]">
          Welcome back, {userName.split(" ")[0] || "User"}
        </h2>
        <p className="text-[14px] md:text-[15px] text-[#63786A]">
          Here is an overview of your recent activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] md:gap-[24px]">
        {/* Total Orders */}
        <div className="bg-white border-2 border-[#E0D4BE] rounded-[16px] md:rounded-[20px] p-[16px] md:p-[24px] flex items-center gap-[12px] md:gap-[16px] shadow-sm">
          <div className="w-[40px] md:w-[48px] h-[40px] md:h-[48px] rounded-full bg-[#254936]/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] text-[#254936]" />
          </div>
          <div>
            <span className="text-[12px] md:text-[13px] font-bold text-[#63786A] uppercase tracking-wider block mb-[2px] md:mb-[4px]">
              Total Orders
            </span>
            <span className="text-[20px] md:text-[24px] font-playfair font-bold text-[#254936]">
              {orders.length}
            </span>
          </div>
        </div>

        {/* Saved Items */}
        <div className="bg-white border-2 border-[#E0D4BE] rounded-[16px] md:rounded-[20px] p-[16px] md:p-[24px] flex items-center gap-[12px] md:gap-[16px] shadow-sm">
          <div className="w-[40px] md:w-[48px] h-[40px] md:h-[48px] rounded-full bg-[#B69355]/10 flex items-center justify-center shrink-0">
            <Heart className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] text-[#B69355]" />
          </div>
          <div>
            <span className="text-[12px] md:text-[13px] font-bold text-[#63786A] uppercase tracking-wider block mb-[2px] md:mb-[4px]">
              Saved Items
            </span>
            <span className="text-[20px] md:text-[24px] font-playfair font-bold text-[#254936]">
              {wishlistCount}
            </span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white border-2 border-[#E0D4BE] rounded-[16px] md:rounded-[20px] p-[16px] md:p-[24px] flex items-center gap-[12px] md:gap-[16px] shadow-sm">
          <div className="w-[40px] md:w-[48px] h-[40px] md:h-[48px] rounded-full bg-[#254936]/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] text-[#254936]" />
          </div>
          <div>
            <span className="text-[12px] md:text-[13px] font-bold text-[#63786A] uppercase tracking-wider block mb-[2px] md:mb-[4px]">
              Total Spent
            </span>
            <span className="text-[20px] md:text-[24px] font-playfair font-bold text-[#254936]">
              Rs. {totalSpent.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white border-2 border-[#E0D4BE] rounded-[16px] md:rounded-[20px] p-[16px] md:p-[24px] shadow-sm">
        <div className="flex items-center justify-between mb-[16px] md:mb-[24px]">
          <h3 className="font-playfair text-[20px] md:text-[24px] font-bold text-[#254936]">
            Recent Orders
          </h3>
          <button
            onClick={() => onNavigateTab("orders")}
            className="text-[14px] font-bold text-[#B69355] hover:text-[#254936] transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            View All <ChevronRight className="w-[16px] h-[16px]" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-[40px]">
            <p className="text-[15px] text-[#63786A]">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E0D4BE]">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.orderId}
                className="py-[16px] flex flex-col sm:flex-row justify-between sm:items-center gap-[16px]"
              >
                <div>
                  <p className="font-bold text-[15px] text-[#254936] mb-[4px]">
                    Order #{order.orderId}
                  </p>
                  <p className="text-[13px] text-[#63786A]">
                    {order.date} • {order.items?.length || 0} items
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-[8px]">
                  <span className="font-bold text-[15px] text-[#254936]">
                    Rs. {(Number(order.totalPrice) || 0).toLocaleString()}
                  </span>
                  <button
                    onClick={() => onViewOrder(order)}
                    className="text-[13px] font-bold text-[#254936] hover:text-[#B69355] transition-colors flex items-center gap-[4px]"
                  >
                    <Eye className="w-[14px] h-[14px]" /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
