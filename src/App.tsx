import React from "react";
import { ShopProvider, useShop } from "./context/ShopContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { SearchModal } from "./components/layout/SearchModal";
import { CartDrawer } from "./components/layout/CartDrawer";
import { QuickViewModal } from "./components/shop/QuickViewModal";
import { WhatsAppButton } from "./components/shared/WhatsAppButton";
import { Toast } from "./components/ui/Toast";
import { BreakpointIndicator } from "./components/ui/BreakpointIndicator";

// Pages
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { WishlistPage } from "./pages/WishlistPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { AdminSignInPage } from "./pages/AdminSignInPage";
import { TrackOrderPage } from "./pages/TrackOrderPage";
import BestSellersPage from "./pages/BestSellersPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsAndConditionsPage } from "./pages/TermsAndConditionsPage";
import { ShippingPolicyPage } from "./pages/ShippingPolicyPage";
import { ReturnPolicyPage } from "./pages/ReturnPolicyPage";

import { motion, AnimatePresence } from "motion/react";

const MainContentSelector: React.FC = () => {
  const { currentPage, navigate } = useShop();

  const renderActiveRoute = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'best-sellers':
        return <BestSellersPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'checkout-success':
        return <CheckoutSuccessPage />;
      case 'sign-in':
        return <SignInPage />;
      case 'sign-up':
        return <SignUpPage />;
      case 'account':
        return <AccountPage />;
      case 'admin':
        return <AdminPage />;
      case 'admin-sign-in':
        return <AdminSignInPage />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'terms-conditions':
        return <TermsAndConditionsPage />;
      case 'shipping-policy':
        return <ShippingPolicyPage />;
      case 'return-policy':
        return <ReturnPolicyPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex-1 min-h-[60vh] relative">
      {/* Fallback button that allows programmatically triggering checkout page */}
      <button
        id="trigger-checkout-btn-direct"
        onClick={() => {
          // Programmatically navigate to checkout view
          const currentPath = document.getElementById("checkout-confirm-order-btn");
          if (!currentPath) {
            // Re-route
            navigate('checkout');
          }
        }}
        className="hidden"
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {renderActiveRoute()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function AppContent() {
  const { currentPage } = useShop();
  const isAdminView = currentPage === "admin" || currentPage === "admin-sign-in";

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#2C2C2C] selection:bg-[#1F4D3A] selection:text-white antialiased">
      {/* Main Header navigation */}
      {!isAdminView && <Header />}

      {/* Dynamic transition layout pages container */}
      <MainContentSelector />

      {/* Global Footer details */}
      {!isAdminView && <Footer />}

      {/* Interactive Overlay modals */}
      <SearchModal />
      <CartDrawer />
      <QuickViewModal />
      <Toast />

      {/* Floating pulse support button */}
      {!isAdminView && <WhatsAppButton />}
    </div>
  );
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  state = { hasError: false, error: null };
  
  constructor(props: {children: React.ReactNode}) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const _this = this as any;
    if (_this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F2EA] p-8">
          <div className="max-w-xl bg-white p-8 rounded-2xl shadow-xl text-center border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">The application encountered an unexpected error.</p>
            <pre className="text-left bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-[300px] mb-6 text-red-500">
              {_this.state.error?.toString()}
              {'\n\n'}
              {_this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#1F4D3A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#C9A227] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return _this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </ErrorBoundary>
  );
}
export { App };
