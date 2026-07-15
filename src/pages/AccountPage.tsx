import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { motion, AnimatePresence } from "motion/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { AccountSidebar } from "../components/account/AccountSidebar";
import { DashboardTab } from "../components/account/DashboardTab";
import { OrderHistoryTab } from "../components/account/OrderHistoryTab";
import { WishlistTab } from "../components/account/WishlistTab";
import { AddressesTab } from "../components/account/AddressesTab";
import { AccountDetailsTab } from "../components/account/AccountDetailsTab";
import { OrderDetailView } from "../components/account/OrderDetailView";
import { ConfirmModal } from "../components/shared/ConfirmModal";

export const AccountPage: React.FC = () => {
  const { navigate, wishlist, products, toggleWishlist, addToCart, cart, user, profile, authLoading, logout, triggerToast, updateProfile, savedAddresses, addAddress, updateAddress, deleteAddress, setPrimaryAddress } = useShop();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === "admin") {
        logout();
        triggerToast("Access Denied: Administrative accounts cannot use the User Portal.", undefined, undefined, "error");
      }
    }
  }, [user, authLoading, profile, logout, triggerToast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('sign-in');
    }
  }, [user, authLoading]);

  // Fetch real orders from database belonging to logged in user
  useEffect(() => {
    const fetchUserOrders = async () => {
      const clerkId = profile?.clerk_id || user?.id;
      if (clerkId) {
        setLoadingOrders(true);
        try {
          const res = await fetch(`/api/user/orders?clerk_id=${clerkId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.orders) {
              const mapped = data.orders.map((o: any) => {
                const items = o.order_items ? o.order_items.map((oi: any) => ({
                  category: oi.products?.category || oi.products?.categories?.name || oi.category,
                  concern: oi.products?.concern || oi.concern,
                  name: oi.product_name || oi.products?.name || "Premium Ayurvedic Formulation",
                  quantity: oi.quantity,
                  variant: oi.variant || "Standard Form",
                  price: Number(oi.price),
                  image: oi.product_image || oi.products?.images?.[0] || oi.products?.image_url || null,
                })) : [];

                return {
                  orderId: o.order_number,
                  confirmation_email: o.confirmation_email,
                  confirmation_phone: o.confirmation_phone,
                  special_instructions: o.special_instructions,
                  user_email: profile?.email || user?.email || o.email,
                  fullName: profile?.full_name || o.shipping_name || "Member",
                  email: profile?.email || user?.email || "",
                  phone: o.phone || "",
                  shippingName: o.shipping_name || "",
                  shippingPhone: o.shipping_phone || "",
                  address: o.shipping_address || "",
                  city: o.city || "",
                  postalCode: o.postal_code || "",
                  paymentMethod: o.payment_method || "COD",
                  paymentStatus: (o.payment_status || "UNPAID").toUpperCase(),
                  totalPrice: o.total_amount,
                  status: (o.status || "Processing"),
                  date: new Date(o.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
                  estimatedDelivery: o.estimated_delivery ? new Date(o.estimated_delivery).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(new Date(o.created_at).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                  discount_amount: o.discount_percentage ? Math.round(o.total_amount * (o.discount_percentage / 100)) : 0,
                  discountPercentage: o.discount_percentage || 0,
                  items
                };
              });
              setOrders(mapped);
            }
          }
        } catch (err) {
          console.warn("Could not fetch user orders from cloud database.", err);
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setLoadingOrders(false);
      }
    };
    fetchUserOrders();
  }, [user, profile]);

  useEffect(() => {
    if (profile) {
      setUserDetails({
        fullName: profile.full_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
      });
    } else if (user) {
      setUserDetails(prev => ({
        ...prev,
        email: user.email || ""
      }));
    }
  }, [profile, user]);

  const handleUpdateDetails = async (details: any) => {
    if (user) {
      const result = await updateProfile({
        fullName: details.fullName,
        phone: details.phone
      });
      if (!result.success) throw new Error(result.error || "Update failed");
      triggerToast("Account details updated successfully!");
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setAddressFormOpen(true);
  };

  const handleSaveAddress = async (addr: any) => {
    try {
      if (editingAddress) {
        const result = await updateAddress({ ...addr, id: editingAddress.id });
        if (result.success) triggerToast("Address updated!");
        else throw new Error(result.error);
      } else {
        const result = await addAddress(addr);
        if (result.success) triggerToast("Address added!");
        else throw new Error(result.error);
      }
      setAddressFormOpen(false);
      setEditingAddress(null);
    } catch (err: any) {
      triggerToast("Failed to save address: " + err.message, undefined, undefined, "error");
    }
  };

  const handleDownloadInvoicePDF = async (elementId: string, orderId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      triggerToast("Invoice capture element not found.", undefined, undefined, "error");
      return;
    }

    setIsExporting(true);
    triggerToast("Generating your high-quality PDF invoice...");

    try {
      const printWidth = 850;
      
      const originalOverflow = element.style.overflow;
      const originalHeight = element.style.height;
      const originalMaxHeight = element.style.maxHeight;
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      const originalPosition = element.style.position;
      const originalClassName = element.getAttribute("class") || "";

      const newClassName = originalClassName
        .replace(/fixed/g, "absolute")
        .replace(/inset-x-4/g, "")
        .replace(/max-w-4xl/g, "")
        .replace(/mx-auto/g, "");
      element.setAttribute("class", newClassName);

      element.style.overflow = 'visible';
      element.style.height = 'max-content';
      element.style.maxHeight = 'none';
      element.style.width = `${printWidth}px`;
      element.style.maxWidth = `${printWidth}px`;
      element.style.position = 'absolute';

      const actions = element.querySelectorAll(".invoice-no-print");
      actions.forEach(act => {
        (act as HTMLElement).style.display = "none";
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      const imgData = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: printWidth,
        height: element.scrollHeight,
        style: {
          overflow: 'visible',
          height: 'max-content',
          maxHeight: 'none',
          width: `${printWidth}px`,
          maxWidth: `${printWidth}px`,
          position: 'absolute',
          transform: 'none',
          left: '0',
          top: '0'
        }
      });

      actions.forEach(act => {
        (act as HTMLElement).style.display = "";
      });
      element.setAttribute("class", originalClassName);
      element.style.overflow = originalOverflow;
      element.style.height = originalHeight;
      element.style.maxHeight = originalMaxHeight;
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.position = originalPosition;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      const contentWidth = pdfWidth - (margin * 2);
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const ratio = imgHeight / imgWidth;
      const contentHeight = contentWidth * ratio;

      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - (margin * 2));

      while (heightLeft >= 0) {
        pdf.addPage();
        position = heightLeft - contentHeight + margin;
        pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
        heightLeft -= (pdfHeight - (margin * 2));
      }

      pdf.save(`WEN-Invoice-${orderId}.pdf`);
      triggerToast("Invoice PDF downloaded successfully!");
    } catch (err: any) {
      console.error("PDF generation failure:", err);
      triggerToast("Could not generate PDF invoice: " + err.message, undefined, undefined, "error");
    } finally {
      setIsExporting(false);
    }
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F4EBDB]/30 to-white flex items-center justify-center">
        <div className="text-[#254936] font-playfair font-bold text-[24px] uppercase tracking-widest animate-pulse">
          Loading Account...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F4EBDB]/30 to-white pt-[120px] pb-[60px] px-[24px]">
        <OrderDetailView
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onDownloadInvoice={handleDownloadInvoicePDF}
          isExporting={isExporting}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4EBDB]/30 to-white pt-[80px] md:pt-[120px] pb-[40px] md:pb-[60px] px-[16px] md:px-[24px] font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-[24px] md:gap-[40px]">
          {/* Sidebar */}
          <div className="w-full lg:w-[25%] shrink-0">
            <AccountSidebar
              userName={userDetails.fullName || user.email || "Member"}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogout={() => {
                showConfirm(
                  "Confirm Logout",
                  "Are you sure you want to log out?",
                  () => logout()
                );
              }}
            />
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-[75%]">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <DashboardTab
                  key="dashboard"
                  userName={userDetails.fullName || user.email || "Member"}
                  orders={orders}
                  wishlistCount={wishlist.length}
                  onNavigateTab={setActiveTab}
                  onViewOrder={(order) => setSelectedOrder(order)}
                />
              )}

              {activeTab === "orders" && (
                <OrderHistoryTab
                  key="orders"
                  orders={orders}
                  loadingOrders={loadingOrders}
                  onViewOrder={(order) => setSelectedOrder(order)}
                  onNavigateShop={() => navigate('shop')}
                />
              )}

              {activeTab === "wishlist" && (
                <WishlistTab
                  key="wishlist"
                  products={products}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                  onNavigateShop={() => navigate('shop')}
                  onNavigateProduct={(id) => navigate('product', id)}
                />
              )}

              {activeTab === "addresses" && (
                <AddressesTab
                  key="addresses"
                  addresses={savedAddresses}
                  onAdd={handleOpenAddAddress}
                  onEdit={handleOpenEditAddress}
                  onDelete={(id) => {
                    showConfirm("Delete Address", "Are you sure you want to delete this address?", () => deleteAddress(id));
                  }}
                  onSetDefault={setPrimaryAddress}
                />
              )}

              {activeTab === "details" && (
                <AccountDetailsTab
                  key="details"
                  userDetails={userDetails}
                  onUpdate={handleUpdateDetails}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AccountPage;
