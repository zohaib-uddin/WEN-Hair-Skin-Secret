import React from "react";
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, FolderTree, MessageSquare, Settings, LogOut, Sparkles, X } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { useAuth } from "@clerk/clerk-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isOpen,
  setIsOpen
}) => {
  const { navigate } = useShop();
  const { signOut } = useAuth();

  const handleAdminLogout = async () => {
    try {
      await signOut();
      navigate("admin-sign-in");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "messages", label: "Messages & Enquiries", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLinkClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Mobile Drawer Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Styled Admin Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 w-[260px] bg-[#0F1411] border-r border-[#1E2B24] text-[#F7F2EA] flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand visual header area */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E2B24]">
          <button
            onClick={() => { navigate("home"); }}
            className="flex flex-col text-left focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-[#C9A227] animate-pulse" />
              <span className="font-playfair text-2xl font-bold tracking-widest text-white">W E N</span>
            </div>
            <span className="font-sans text-[8.5px] font-bold text-[#C9A227] tracking-[0.22em] uppercase block -mt-1">
              Secret Control Lab
            </span>
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-[#757575] hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4.5 py-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 group outline-none ${
                  isActive
                    ? "bg-[#C9A227] text-[#0A0D0B] shadow-lg shadow-[#C9A227]/10 border-l-4 border-[#1F4D3A]"
                    : "text-[#757575] hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform duration-300 ${isActive ? "text-[#0A0D0B] scale-105" : "text-[#757575] group-hover:text-[#C9A227]"}`} />
                <span className="font-sans">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom logout area */}
        <div className="p-6 border-t border-[#1E2B24] space-y-3">
          <button
            onClick={handleAdminLogout}
            className="w-full py-3.5 px-4.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 text-xs font-bold tracking-widest uppercase rounded-xl text-red-400 hover:text-red-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
