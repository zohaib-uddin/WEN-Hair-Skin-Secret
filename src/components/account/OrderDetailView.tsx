import React from "react";
import { ArrowLeft, MapPin, Truck, CheckCircle2, FileText, Download, User, Phone, Mail, CreditCard, Box } from "lucide-react";
import { motion } from "motion/react";

interface OrderDetailViewProps {
  order: any;
  onBack: () => void;
  onDownloadInvoice: (id: string, orderId: string) => void;
  isExporting: boolean;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onBack,
  onDownloadInvoice,
  isExporting,
}) => {
  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-[800px] mx-auto w-full font-sans pb-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-[8px] text-[14px] font-bold text-[#6b6b6b] hover:text-[#1F4D3A] transition-colors cursor-pointer mb-[24px]"
      >
        <ArrowLeft className="w-[18px] h-[18px]" /> Back to Orders
      </button>

      <div
        id="invoice-capture-area"
        className="bg-white border border-[#e5e5e5] rounded-[16px] md:rounded-[24px] p-[20px] md:p-[40px] shadow-sm relative overflow-visible"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[24px] pb-[32px] border-b border-[#e5e5e5]">
          <div>
            <span className="font-playfair text-[32px] font-bold tracking-widest text-[#1F4D3A]">WEN</span>
            <span className="font-sans text-[10px] font-bold text-[#C9A227] tracking-[0.2em] uppercase block">
              HAIR & SKIN SECRET
            </span>
            <div className="mt-[16px]">
              <h2 className="font-bold text-[20px] text-[#1a1a1a]">Order Details #{order.orderId}</h2>
              <p className="text-[14px] text-[#6b6b6b]">Placed on {order.date}</p>
            </div>
          </div>
          
          <div className="text-left sm:text-right">
            <span
              className={`inline-block text-[12px] font-bold uppercase tracking-wider px-[16px] py-[6px] rounded-full mb-[12px] ${
                order.status === "Delivered"
                  ? "bg-[#10b981]/10 text-[#10b981]"
                  : order.status === "Processing"
                  ? "bg-[#C9A227]/10 text-[#C9A227]"
                  : "bg-gray-100 text-[#6b6b6b]"
              }`}
            >
              {order.status || "Processing"}
            </span>
            <div className="invoice-no-print">
              <button
                onClick={() => onDownloadInvoice("invoice-capture-area", order.orderId)}
                disabled={isExporting}
                className="flex items-center gap-[8px] text-[13px] font-bold text-[#1F4D3A] hover:text-[#C9A227] transition-colors cursor-pointer"
              >
                <Download className="w-[16px] h-[16px]" />
                {isExporting ? "Generating PDF..." : "Download Invoice"}
              </button>
            </div>
          </div>
        </div>

        {/* Customer & Communication */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[32px] py-[32px] border-b border-[#e5e5e5]">
          <div className="space-y-[12px]">
            <h3 className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-[8px]">
              <User className="w-[16px] h-[16px]" /> Customer Details
            </h3>
            <div className="text-[14px] text-[#1a1a1a] leading-relaxed space-y-1">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6b6b6b]">Full Name</span>
                <span className="font-bold">{order.fullName || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6b6b6b]">Email Address</span>
                <span>{order.user_email || order.email || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6b6b6b]">Contact Number</span>
                <span>{order.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-[12px]">
            <h3 className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-[8px]">
              <Mail className="w-[16px] h-[16px]" /> Order Communication Details
            </h3>
            <div className="text-[14px] text-[#1a1a1a] leading-relaxed space-y-1">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6b6b6b]">Confirmation Email</span>
                <span>{order.confirmation_email || order.email || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6b6b6b]">Confirmation Phone (WhatsApp)</span>
                <span>{order.confirmation_phone || order.phone || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Billing Registry */}
        <div className="py-[32px] border-b border-[#e5e5e5]">
          <h3 className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-[8px] mb-[16px]">
            <MapPin className="w-[16px] h-[16px]" /> Shipping & Billing Registry
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
            <div className="space-y-[12px] text-[14px] text-[#1a1a1a]">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Country</span><span className="font-medium">Pakistan</span></div>
                <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">City</span><span className="font-medium">{order.city || "N/A"}</span></div>
              </div>
              <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Recipient Full Name</span><span className="font-bold">{order.shippingName || order.fullName || "N/A"}</span></div>
              <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Shipping Phone</span><span>{order.shippingPhone || order.phone || "N/A"}</span></div>
              <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Address details</span><span>{order.address || "N/A"}</span></div>
            </div>
            <div className="space-y-[12px] text-[14px] text-[#1a1a1a]">
              <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Billing Address</span><span>Same as shipping address</span></div>
              <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Postal Code</span><span>{order.postalCode || "N/A"}</span></div>
              <div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Special Instructions</span><span>{order.special_instructions || order.specialInstructions || "None"}</span></div>
            </div>
          </div>
        </div>

        {/* Status & Payment */}
        <div className="py-[32px] border-b border-[#e5e5e5]">
          <h3 className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-[8px] mb-[16px]">
            <CreditCard className="w-[16px] h-[16px]" /> Status & Payment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
            <div className="flex flex-col text-[14px]">
              <span className="text-[11px] text-[#6b6b6b]">Payment Method</span>
              <span className="font-bold uppercase">{order.paymentMethod || "cod"}</span>
            </div>
            <div className="flex flex-col text-[14px]">
              <span className="text-[11px] text-[#6b6b6b]">Payment Status</span>
              <span className="font-bold uppercase text-[#1F4D3A]">{order.paymentStatus || "UNPAID"}</span>
            </div>
          </div>
        </div>

        {/* Purchased Articles */}
        <div className="py-[32px] border-b border-[#e5e5e5]">
          <h3 className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-[8px] mb-[24px]">
            <Box className="w-[16px] h-[16px]" /> Purchased Articles
          </h3>
          <div className="space-y-[24px]">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex gap-[16px] bg-[#f9f9f9] p-[12px] rounded-[12px]">
                <div className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-white shrink-0 border border-[#e5e5e5] p-1">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6b6b6b] text-[10px] font-bold">WEN</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {(item.category || item.concern) && (
                      <p className="text-[10px] text-[#C9A227] font-bold tracking-[0.15em] uppercase mb-1">
                        {[item.category, item.concern].filter(Boolean).join(" • ")}
                      </p>
                    )}
                    <h4 className="font-bold text-[15px] text-[#1F4D3A] line-clamp-1">{item.name}</h4>
                    <p className="text-[12px] text-[#6b6b6b]">Size: {item.variant || "Standard"}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 border-t border-[#e5e5e5] pt-2">
                    <span className="text-[13px] font-bold text-[#1a1a1a]">Rs. {(Number(item.price) || 0).toLocaleString()} <span className="font-normal text-[#6b6b6b]">x {item.quantity}</span></span>
                    <span className="font-bold text-[15px] text-[#1F4D3A]">
                      Total: Rs. {((Number(item.price) || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Accounting */}
        <div className="pt-[32px] bg-white rounded-b-[16px] md:rounded-b-[24px]">
          <h3 className="text-[12px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-[8px] mb-[16px]">
            <FileText className="w-[16px] h-[16px]" /> Financial Accounting
          </h3>
          <div className="space-y-[12px] max-w-[400px] ml-auto text-[14px]">
            <div className="flex justify-between text-[#6b6b6b]">
              <span>Formulations Subtotal</span>
              <span>
                Rs. {(Number(order.totalPrice) + (order.discount_amount || 0)).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between text-[#6b6b6b]">
              <span>Coupon Applied</span>
              <span className={order.discount_amount > 0 ? "text-[#10b981] font-medium" : ""}>
                {order.discount_amount > 0 ? `- Rs. ${order.discount_amount.toLocaleString()}` : "None (Rs. 0)"}
              </span>
            </div>
            
            <div className="flex justify-between text-[#6b6b6b]">
              <span>Express Courier Delivery (COD)</span>
              <span className="font-bold text-[#C9A227] tracking-wider text-[11px] uppercase mt-0.5">Free Shipping</span>
            </div>
            
            <div className="flex justify-between font-bold text-[22px] text-[#1F4D3A] pt-[16px] border-t-2 border-[#1F4D3A]/10 mt-[16px]">
              <span>Total Amount Received</span>
              <span>Rs. {(Number(order.totalPrice) || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

