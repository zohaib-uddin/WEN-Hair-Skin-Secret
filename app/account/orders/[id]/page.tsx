"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Clock, 
  DollarSign, 
  Truck, 
  CheckCircle2, 
  MessageSquare,
  ShieldAlert,
  Loader2,
  FileText,
  User,
  Mail,
  Tag
} from "lucide-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useShop } from "../../../../src/context/ShopContext";

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
  shipping_address: string;
  city: string;
  phone: string;
  payment_method: string;
  tracking_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { user, profile } = useShop();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrderDetail = async () => {
    if (!orderId) return;
    const clerkId = profile?.clerk_id || user?.id;
    if (!clerkId) {
      // Don't mark loading false immediately to allow Auth to load
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      // Fetch user's orders and filter by order ID locally for bulletproof safety
      const res = await fetch(`/api/user/orders?clerk_id=${clerkId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        const foundOrder = (data.orders || []).find((o: Order) => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setErrorMsg("Royal order record not found in your purchase history.");
        }
      } else {
        setErrorMsg(data.error || "Formulation ledger inaccessible.");
      }
    } catch (e: any) {
      console.error("Error retrieving tracking data:", e);
      setErrorMsg(`Connection error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const parseCouponFromNotes = (notes: string | null) => {
    if (!notes) return null;
    const match = notes.match(/\[Promo:\s*([A-Z0-9]+)\s*\((\d+)%\s*Off\)\]/i);
    if (match) {
      return {
        code: match[1],
        discount: parseInt(match[2], 10),
        cleanNotes: notes.replace(/\[Promo:\s*[A-Z0-9]+\s*\(\d+%\s*Off\)\]/i, "").trim()
      };
    }
    return null;
  };

  useEffect(() => {
    if (user || profile || orderId) {
      fetchOrderDetail();
    } else {
      // Set loading false if definitely no user (guest session) after some grace period
      const timer = setTimeout(() => {
        if (!user && !profile) {
          setLoading(false);
          setErrorMsg("Please sign in to view your royal order details.");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, profile, orderId]);

  // Determine stage score for elegant visual timeline
  const getStatusStep = (status: Order["status"]): number => {
    switch (status) {
      case "pending": return 1;
      case "processing": return 2;
      case "shipped": return 3;
      case "delivered": return 5; // We treat Out For Delivery as intermediate step 4
      case "cancelled": return -1;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  const promoInfo = order ? parseCouponFromNotes(order.notes) : null;
  const displayNotes = promoInfo ? promoInfo.cleanNotes : (order ? order.notes : "");
  
  const orderSubtotal = order ? order.order_items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0) : 0;
  const shippingCost = orderSubtotal >= 2000 ? 0 : 250;
  const promoDiscount = promoInfo ? Math.round(orderSubtotal * (promoInfo.discount / 100)) : 0;

  // Render Pakistani WhatsApp support redirection URL
  const getWhatsAppHelpLink = () => {
    if (!order) return "";
    const cleanNumber = "923211234567"; // Replace with brand care center number
    const message = `Assalam-o-Alaikum, I need help regarding my Wen order number: ${order.order_number}. My tracking ID is: ${order.tracking_id || "Unreleased"}.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  // Generate a beautiful physical printable invoice PDF via browser native saving/printing
  const downloadInvoice = () => {
    if (!order) return;
    
    const customerName = profile?.full_name || user?.fullName || "Valued Patron";
    const customerEmail = profile?.email || user?.primaryEmailAddress?.emailAddress || "N/A";
    const customerPhone = order.phone || profile?.phone || user?.primaryPhoneNumber?.phoneNumber || "N/A";

    const itemsRows = order.order_items.map((item, index) => {
      const prodName = item.products?.name || "Premium Ayurvedic Formulation";
      const qty = item.quantity;
      const unitPrice = item.price;
      const sub = unitPrice * qty;
      return `
        <tr style="border-bottom: 1px solid #eaeaea;">
          <td style="padding: 12px 8px; font-size: 11px; text-align: left; font-family: sans-serif;">${index + 1}</td>
          <td style="padding: 12px 8px; font-size: 11px; text-align: left; font-family: sans-serif; font-weight: bold; color: #1F4D3A;">${prodName}</td>
          <td style="padding: 12px 8px; font-size: 11px; text-align: center; font-family: monospace;">${qty}</td>
          <td style="padding: 12px 8px; font-size: 11px; text-align: right; font-family: monospace;">Rs. ${Number(unitPrice).toLocaleString()}</td>
          <td style="padding: 12px 8px; font-size: 11px; text-align: right; font-family: monospace; font-weight: bold;">Rs. ${Number(sub).toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${order.order_number}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; color: #333; background: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
              .no-print { display: none; }
            }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; background: #ffffff; color: #333333; line-height: 1.4; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .logo-title { font-size: 24px; font-weight: 900; color: #1F4D3A; letter-spacing: 2px; text-transform: uppercase; font-family: 'Playfair Display', Georgia, serif; }
            .logo-sub { font-size: 9px; color: #C9A227; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
            .invoice-label { font-size: 28px; font-weight: 300; text-align: right; text-transform: uppercase; color: #1F4D3A; letter-spacing: 1px; }
            .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .meta-section { width: 50%; vertical-align: top; font-size: 11px; }
            .meta-label { font-weight: bold; text-transform: uppercase; color: #1F4D3A; font-size: 10px; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 2px solid #C9A227; padding-bottom: 4px; width: fit-content; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 30px; margin-bottom: 30px; }
            .items-table th { background: #1F4D3A; color: #ffffff; font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 10px 8px; letter-spacing: 1px; }
            .totals-table { width: 40%; margin-left: auto; border-collapse: collapse; font-size: 12px; margin-top: 20px; }
            .totals-table td { padding: 8px; }
            .brand-footer { text-align: center; margin-top: 80px; font-size: 10px; color: #777777; border-top: 1px solid #eaeaea; padding-top: 20px; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>
                <div class="logo-title">WEN</div>
                <div class="logo-sub">HAIR & SKIN SECRET</div>
                <div style="font-size: 10px; color: #666; margin-top: 10px;">
                  Elite Organic Botanicals & Apothecary<br/>
                  Lahore, Pakistan<br/>
                  Support: support@wenhairskinsecret.com
                </div>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <div class="invoice-label">Invoice</div>
                <div style="font-size: 11px; color: #555; margin-top: 8px;">
                  <strong>Invoice No:</strong> INV-${order.order_number.replace("WEN-", "")}<br/>
                  <strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "long" })}<br/>
                  <strong>Payment Status:</strong> Paid (Cash on Delivery / COD)<br/>
                  <strong>Tracking ID:</strong> ${order.tracking_id || "Awaiting Release"}
                </div>
              </td>
            </tr>
          </table>

          <table class="meta-table">
            <tr>
              <td class="meta-section" style="padding-right: 20px;">
                <div class="meta-label">Billed To</div>
                <div style="font-size: 11px; color: #333; font-weight: bold;">${customerName}</div>
                <div style="font-size: 11px; color: #555; margin-top: 4px;">
                  Email: ${customerEmail}<br/>
                  Phone: ${customerPhone}
                </div>
              </td>
              <td class="meta-section" style="padding-left: 20px;">
                <div class="meta-label">Shipping Coordinates</div>
                <div style="font-size: 11px; color: #333; font-weight: bold;">${customerName}</div>
                <div style="font-size: 11px; color: #555; margin-top: 4px; line-height: 1.5;">
                  Address: ${order.shipping_address}<br/>
                  City: ${order.city}, Pakistan<br/>
                  Phone: ${order.phone}
                </div>
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 5%; text-align: left;">#</th>
                <th style="width: 55%; text-align: left;">Botanical Formulation / Product</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Unit Price</th>
                <th style="width: 15%; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td style="text-align: left; color: #666;">Subtotal:</td>
              <td style="text-align: right; font-family: monospace;">Rs. ${orderSubtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="text-align: left; color: #666;">Shipping Fee:</td>
              <td style="text-align: right; font-family: monospace;">${shippingCost === 0 ? "Free (Gold Tier)" : `Rs. ${shippingCost}`}</td>
            </tr>
            ${promoInfo ? `
            <tr>
              <td style="text-align: left; color: #e11d48;">Promo Discount (${promoInfo.discount}%):</td>
              <td style="text-align: right; font-family: monospace; color: #e11d48;">-Rs. ${promoDiscount.toLocaleString()}</td>
            </tr>
            ` : ""}
            <tr style="border-top: 2px solid #1F4D3A; font-weight: bold; font-size: 14px; color: #1F4D3A;">
              <td style="text-align: left; padding-top: 12px;">Grand Total:</td>
              <td style="text-align: right; padding-top: 12px; font-family: monospace;">Rs. ${Number(order.total_amount).toLocaleString()}</td>
            </tr>
          </table>

          <div style="margin-top: 50px; padding: 15px; border-radius: 12px; background: #FCFBEE; border: 1px dashed #C9A227; font-size: 10px; color: #555; line-height: 1.6;">
            <strong>Important Declaration:</strong> All our formulations are freshly distilled and bottled in small batches to preserve botanical potency. Store in a cool, shaded environment. We offer a 100% sensory satisfaction guarantee. For any assistance, reach our beauty care sanctum at support@wenhairskinsecret.com.
          </div>

          <div class="brand-footer">
            Thank you for patronizing Wen Hair & Skin Secret.<br/>
            <em>This is a computer-generated luxury ledger invoice. No physical signature required.</em>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    // Write to a temporary iframe and print it
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.right = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(invoiceHtml);
      doc.close();
    }

    // Clean up iframe after printing dialog closes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#FCFBEE]/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Indicator */}
        <button 
          onClick={() => router.push("/account/orders")}
          className="flex items-center gap-2 text-sm text-[#1F4D3A] hover:text-[#1F4D3A]/85 font-sans font-bold uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Ledger
        </button>

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center space-y-6">
            <Loader2 className="w-10 h-10 animate-spin text-[#1F4D3A] mx-auto" />
            <p className="text-gray-500 font-sans text-sm">Decoding botanical shipment nodes...</p>
          </div>
        ) : errorMsg || !order ? (
          <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-playfair font-bold text-gray-950">Inaccessible Log</h3>
            <p className="text-sm font-sans text-gray-500 mt-2">{errorMsg || "Invalid configuration link."}</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Top Order Overview Banner */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#C9A227]">Shipped via Secret Reserve</span>
                <h1 className="text-3xl font-playfair font-bold text-gray-900 mt-1">Order {order.order_number}</h1>
                <p className="text-xs font-sans text-gray-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Booked On: {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                <button
                  onClick={downloadInvoice}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1F4D3A] hover:bg-[#153427] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
                >
                  <FileText className="w-4 h-4 text-[#C9A227]" />
                  <span>Download Invoice (PDF)</span>
                </button>

                <div className="bg-[#1F4D3A]/5 border border-[#1F4D3A]/10 px-5 py-3.5 rounded-2xl flex-shrink-0 text-center sm:text-left">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-sans font-bold">Total Bill (Rs)</span>
                  <span className="text-xl font-playfair font-bold text-[#1F4D3A]">Rs. {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* VISUAL ORDER TIMELINE CARD */}
            {order.status === "cancelled" ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl">
                <h3 className="font-playfair font-semibold text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" /> This order has been cancelled
                </h3>
                <p className="text-sm font-sans mt-1">
                  If this is a mistake, please contact our beauty consultants via support channels.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-xs">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-400 font-sans mb-8">Delivery Progress</h3>
                
                {/* Visual Timeline Nodes */}
                <div className="relative">
                  {/* Progress Line base */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-gray-100 -z-10 rounded-full md:left-6 md:right-6">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1F4D3A] to-[#C9A227] transition-all duration-500 rounded-full"
                      style={{ 
                        width: `${
                          currentStep === 1 ? "0%" :
                          currentStep === 2 ? "30%" :
                          currentStep === 3 ? "65%" :
                          currentStep === 5 ? "100%" : "0%"
                        }` 
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-center">
                    
                    {/* Step 1: Placed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                        currentStep >= 1 ? "bg-[#1F4D3A] text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className={`text-xs font-bold mt-2 font-sans ${currentStep >= 1 ? "text-[#1F4D3A]" : "text-gray-400"}`}>Placed</p>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                        currentStep >= 2 ? "bg-[#1F4D3A] text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className={`text-xs font-bold mt-2 font-sans ${currentStep >= 2 ? "text-[#1F4D3A]" : "text-gray-400"}`}>Processing</p>
                    </div>

                    {/* Step 3: Shipped */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                        currentStep >= 3 ? "bg-[#C9A227] text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <p className={`text-xs font-bold mt-2 font-sans ${currentStep >= 3 ? "text-[#C9A227]" : "text-gray-400"}`}>Shipped</p>
                    </div>

                    {/* Step 4: Out for Delivery */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                        currentStep >= 3 && order.status !== "shipped" && order.status !== "processing" && order.status !== "pending"
                          ? "bg-[#C9A227] text-white" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <p className={`text-xs font-bold mt-2 font-sans ${currentStep >= 3 && order.status === "delivered" ? "text-[#C9A227]" : "text-gray-400"}`}>Out for Transit</p>
                    </div>

                    {/* Step 5: Delivered */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                        currentStep >= 5 ? "bg-[#1F4D3A] text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className={`text-xs font-bold mt-2 font-sans ${currentStep >= 5 ? "text-[#1F4D3A]" : "text-gray-400"}`}>Delivered</p>
                    </div>

                  </div>
                </div>

                {/* Tracking ID visual box */}
                {order.tracking_id && (
                  <div className="mt-10 bg-amber-50/50 rounded-2xl border border-amber-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-[#C9A227]" />
                      <div>
                        <p className="text-xs font-sans font-bold uppercase tracking-wide text-gray-400">Logistic Tracking ID</p>
                        <p className="text-md font-mono font-bold text-gray-800">{order.tracking_id}</p>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 bg-white border border-gray-150 rounded-xl text-xs uppercase tracking-widest font-extrabold font-sans text-gray-600">
                      TCS Pakistan
                    </span>
                  </div>
                )}

              </div>
            )}

            {/* ORDER ITEMS SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column: Shipment Specs */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Customer Details */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#C9A227] font-sans flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Customer Details
                  </h4>
                  <div className="space-y-2.5 text-xs font-sans text-gray-800">
                    <p className="flex items-center gap-2">
                      <strong className="text-gray-400 font-medium">Name:</strong>
                      <span className="font-semibold text-gray-900">{profile?.full_name || user?.fullName || "Valued Patron"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <strong className="text-gray-400 font-medium">Email:</strong>
                      <span className="text-gray-600 truncate">{profile?.email || user?.primaryEmailAddress?.emailAddress || "N/A"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <strong className="text-gray-400 font-medium">Phone:</strong>
                      <span className="text-gray-600">{order.phone || profile?.phone || "N/A"}</span>
                    </p>
                  </div>
                </div>

                {/* Shipment Specs */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#C9A227] font-sans flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Shipping Address
                    </h4>
                    <p className="text-sm flex items-start gap-2 text-gray-800 leading-relaxed font-sans">
                      <span>{order.shipping_address}, {order.city}</span>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#C9A227] font-sans flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Billing Address
                    </h4>
                    <p className="text-sm flex items-start gap-2 text-gray-800 leading-relaxed font-sans">
                      <span>{order.shipping_address}, {order.city} (Same as Shipping)</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-550 font-sans bg-[#FCFBEE] p-3 rounded-xl border border-[#E8E1D3]/50 flex items-center justify-between">
                      <span>Payment Method:</span>
                      <strong className="uppercase text-[#1F4D3A] font-bold">{order.payment_method}</strong>
                    </p>
                  </div>
                </div>

                {/* Coupon Applied card */}
                {promoInfo ? (
                  <div className="bg-emerald-50/40 rounded-3xl border border-emerald-100/50 p-6 shadow-xs space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-800 font-sans flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-emerald-600" /> Coupon Applied
                    </h4>
                    <div className="text-xs font-sans text-emerald-900 space-y-1.5">
                      <p>Code: <strong className="font-mono bg-emerald-100/70 px-2 py-0.5 rounded text-emerald-800">{promoInfo.code}</strong></p>
                      <p>Discount: <strong className="font-bold">{promoInfo.discount}% off</strong> applied to formulas!</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50/50 rounded-3xl border border-gray-100 p-6 shadow-xs">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 font-sans flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-gray-450" /> Promo Coupon
                    </h4>
                    <p className="text-[11px] font-sans text-gray-500 mt-1.5">No botanical coupon applied to this transaction ledger.</p>
                  </div>
                )}

                {displayNotes && (
                  <div className="bg-amber-50/20 rounded-2xl border border-amber-100/40 p-5 text-xs text-gray-600 leading-relaxed font-sans">
                    <strong>Special Instructions:</strong> "{displayNotes}"
                  </div>
                )}
              </div>

              {/* Right Column: Items details */}
              <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs h-fit">
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 font-sans mb-4">Formula Composition</h4>
                
                <div className="divide-y divide-gray-100">
                  {order.order_items.map((item) => {
                    const fallbackImg = "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop";
                    // Support both array of images or simple singular image field or fallback
                    const mainImage = item.products?.images?.[0] || (item.products as any)?.image || fallbackImg;
                    
                    return (
                      <div key={item.id} className="flex items-center gap-4 justify-between py-3.5 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-150/40 flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={mainImage} 
                              alt={item.products?.name || "Botanical Formulation"} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{item.products?.name || "Botanical Extract"}</p>
                            <p className="text-xs text-gray-475 font-sans mt-0.5 font-mono">Qty: {item.quantity} x Rs. {Number(item.price).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-900 font-sans font-mono">Rs. {Number(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Financial calculations breakdown */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-3.5 text-xs font-sans text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-gray-900 font-mono">Rs. {orderSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping & Sourcing:</span>
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Free Sourcing
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-900 font-mono">Rs. {shippingCost}</span>
                    )}
                  </div>
                  {promoInfo && (
                    <div className="flex justify-between items-center text-rose-600 font-semibold">
                      <span>Promo Discount ({promoInfo.discount}%):</span>
                      <span className="font-mono">-Rs. {promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-150 flex items-center justify-between text-sm font-bold text-gray-900">
                    <span className="text-gray-800">Grand Total:</span>
                    <span className="text-lg font-black text-[#1F4D3A] font-mono">Rs. {Number(order.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp Call to Action help button */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-emerald-950">
                <MessageSquare className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold font-sans">Require immediate assistance?</h4>
                  <p className="text-xs text-emerald-800/85 font-sans">Chat directly with a beauty consultant regarding formulation status or logistics.</p>
                </div>
              </div>
              <a 
                href={getWhatsAppHelpLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba56] text-white text-xs font-bold uppercase tracking-wider font-sans rounded-xl text-center shadow-xs transition"
              >
                Chat on WhatsApp
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
