import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { LogIn, UserPlus, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { useSignIn, useAuth, useUser } from "@clerk/clerk-react";

export const AdminSignInPage: React.FC = () => {
  const { navigate, triggerToast } = useShop();
  const { isLoaded: isLoadedSignIn, signIn, setActive: setActiveSignIn } = useSignIn();
  const { userId, signOut } = useAuth();
  const { user: clerkUser, isLoaded: isLoadedUser } = useUser();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Securely verify admin access upon successful authentication
  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (userId && isLoadedUser && clerkUser) {
        setLoading(true);
        setErrorMsg("");
        try {
          const emailLower = (clerkUser.primaryEmailAddress?.emailAddress || "").toLowerCase();
          const isEmailAdmin = emailLower.includes("admin") || emailLower === "zohaibuddin376@gmail.com" || emailLower === "admin@wenhairskin.com";
          const clerkRole = (clerkUser.publicMetadata?.role === "admin" || isEmailAdmin) ? "admin" : "customer";

          // 1. Instantly force synching the logged-in admin user to Supabase profiles to guarantee DB correctness
          await fetch("/api/sync-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerk_id: userId,
              email: clerkUser.primaryEmailAddress?.emailAddress || "",
              full_name: clerkUser.fullName || "WEN Member",
              phone: clerkUser.primaryPhoneNumber?.phoneNumber || "N/A",
              avatar_url: clerkUser.imageUrl || "",
              role: clerkRole,
            }),
          });

          // 2. Now verify with database REST API
          const checkRes = await fetch(`/api/user-data/${userId}`);
          if (checkRes.ok) {
            const data = await checkRes.json();
            if (data.success && data.profile && data.profile.role === "admin") {
              triggerToast("Welcome back, Administrator!");
              navigate("admin");
              return;
            }
          }
          
          // Force sign out if they do not have the admin role
          await signOut();
          setErrorMsg("Access Denied: This account is not registered as an administrator.");
        } catch (err: any) {
          console.error("Error verifying admin status:", err);
          await signOut();
          setErrorMsg("Failed to verify administrative status.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (userId && isLoadedUser && clerkUser) {
      verifyAdminAccess();
    }
  }, [userId, isLoadedUser, clerkUser, navigate, signOut, triggerToast]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoadedSignIn) return;
    setLoading(true);
    setErrorMsg("");

    try {
      // Authenticate via Clerk - verification is handled by the useEffect above
      let result = await signIn.create({
        identifier: email,
        password: password,
      });

      // 1. If it needs first factor, check if we can submit password
      if (result.status === "needs_first_factor") {
        const hasPasswordStrategy = result.supportedFirstFactors?.some(
          (factor: any) => factor.strategy === "password"
        );
        if (hasPasswordStrategy) {
          result = await signIn.attemptFirstFactor({
            strategy: "password",
            password: password,
          });
        }
      }

      // 2. If complete, activate the session immediately
      if (result.status === "complete") {
        await setActiveSignIn({ session: result.createdSessionId });
        return;
      }

      // 3. If MFA or email verification code is forced by Clerk config
      if (result.status === "needs_second_factor" || result.status === "needs_first_factor") {
        const strategy = result.status === "needs_second_factor"
          ? result.supportedSecondFactors?.[0]?.strategy
          : result.supportedFirstFactors?.find((f: any) => f.strategy !== "password")?.strategy;

        if (strategy) {
          await signIn.prepareFirstFactor({ strategy: strategy as any });
          setShowCodeVerification(true);
          triggerToast("A verification code has been dispatched. Please check your email.");
        } else {
          setErrorMsg("Could not verify credentials. No valid login strategy available.");
        }
      } else {
        setErrorMsg(`Authentication session is incomplete (Status: ${result.status}). Please make sure you are registered and your email is verified.`);
      }
    } catch (err: any) {
      console.error("Clerk admin login error:", err);
      setErrorMsg(err.errors?.[0]?.longMessage || err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoadedSignIn) return;
    setLoading(true);
    setErrorMsg("");

    try {
      let result;
      if (signIn.status === "needs_second_factor") {
        result = await signIn.attemptSecondFactor({
          strategy: (signIn.supportedSecondFactors?.[0]?.strategy || "email_code") as any,
          code: verificationCode,
        });
      } else {
        result = await signIn.attemptFirstFactor({
          strategy: (signIn.supportedFirstFactors?.find((f: any) => f.strategy !== "password")?.strategy || "email_code") as any,
          code: verificationCode,
        });
      }

      if (result.status === "complete") {
        await setActiveSignIn({ session: result.createdSessionId });
        triggerToast("Verification successful. Authorized access granted.");
      } else {
        setErrorMsg("Verification code is incorrect or expired.");
      }
    } catch (err: any) {
      console.error("Clerk admin verification code error:", err);
      setErrorMsg(err.errors?.[0]?.longMessage || err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Direct call to our backend sync / create admin route
      const registerRes = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phone: "N/A",
          securityCode: "WEN-ADMIN-2026",
        }),
      });

      const data = await registerRes.json();
      if (!registerRes.ok || !data.success) {
        throw new Error(data.error || "Failed to register administrative account.");
      }

      triggerToast("Administrative account successfully initiated. Please Sign In to activate your session.");
      setErrorMsg("");
      setIsRegisterMode(false);
    } catch (err: any) {
      console.error("Admin registration error:", err);
      setErrorMsg(err.message || "Failed to initiate administrative registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-12 bg-[#0E1210] text-[#F7F2EA] font-sans">
      {/* Visual background sidebar (5 cols on wide screens) */}
      <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#121E18] to-[#0A0D0C] border-r border-[#1F3D2F]/20 text-left">
        <div>
          <span className="font-playfair text-3xl font-black tracking-widest text-[#C9A227]">W E N</span>
          <span className="text-[9px] font-bold text-[#757575] tracking-[0.25em] uppercase block -mt-1">
            HAIR & SKIN SECRET
          </span>
        </div>

        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-[10px] font-mono font-bold uppercase py-1 px-4 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Core System Portal
          </span>
          <h1 className="font-playfair text-4xl font-extrabold text-[#F7F2EA] leading-tight">
            Administrative <br />Sanctum Control
          </h1>
          <p className="font-light text-xs text-[#757575] leading-relaxed max-w-sm">
            Access real-time customer logistics, order fulfillment triggers, messaging pipelines, and clinical-grade catalog controls.
          </p>
        </div>

        <button
          onClick={() => navigate("home")}
          className="text-xs font-semibold text-[#C9A227] hover:text-[#F7F2EA] flex items-center gap-2 uppercase tracking-widest transition-colors cursor-pointer"
        >
         
        </button>
      </div>

      {/* Main Login / Signup Form panel (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-8 sm:p-16 bg-[#0B0D0C]">
        <div className="max-w-md w-full text-left space-y-8">
          <div className="space-y-2">
            <span className="text-[#C9A227] text-[10px] font-mono font-bold uppercase tracking-[0.2em] block">
              Cryptographic Key Portal
            </span>
            <h2 className="font-playfair text-3xl font-black tracking-wide text-white uppercase">
              {isRegisterMode 
                ? "Initiate Admin Key" 
                : "Access Admin Controls"}
            </h2>
            <p className="text-xs text-[#757575] font-light font-sans">
              {isRegisterMode
                ? "Register an authorized administrator profile on the secure Clerk & Supabase systems."
                : "Enter your secure admin credentials to access the backend command dashboard."}
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-950/40 border border-rose-900 text-rose-200 rounded-xl text-xs font-sans flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider block">Security Notice</span>
                <p className="font-light leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Tab Selection */}
          <div className="flex border-b border-[#1F3D2F]/40">
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg("");
              }}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold transition-all border-b-2 text-center cursor-pointer ${
                !isRegisterMode
                  ? "border-[#C9A227] text-[#C9A227]"
                  : "border-transparent text-[#757575] hover:text-gray-300"
              }`}
            >
              Sign In
            </button>
            {/* <button
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMsg("");
              }}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold transition-all border-b-2 text-center cursor-pointer ${
                isRegisterMode
                  ? "border-[#C9A227] text-[#C9A227]"
                  : "border-transparent text-[#757575] hover:text-gray-300"
              }`}
            >
              Register Admin
            </button> */}
          </div>

          {!isRegisterMode ? (
            /* Sign In Block */
            !showCodeVerification ? (
              /* Sign In Form */
              <form onSubmit={handleAdminSignIn} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#757575] uppercase tracking-widest">
                      Authorized Admin Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@wenhairskin.com"
                      className="w-full px-4 py-3 bg-[#111413] border border-[#1F3D2F]/30 rounded-xl outline-none focus:border-[#C9A227] text-sm text-[#F7F2EA] placeholder-gray-600 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#757575] uppercase tracking-widest">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 bg-[#111413] border border-[#1F3D2F]/30 rounded-xl outline-none focus:border-[#C9A227] text-sm text-[#F7F2EA] placeholder-gray-600 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#1F4D3A] hover:bg-[#153427] text-[#F7F2EA] hover:text-white font-sans font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 text-[#C9A227]" />
                  <span>{loading ? "Decrypting Credentials..." : "Unlock Admin Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Verification Code Form */
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#757575] uppercase tracking-widest">
                      Verification Code (Sent to Email)
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                      placeholder="••••••"
                      className="w-full px-4 py-3 bg-[#111413] border border-[#1F3D2F]/30 rounded-xl outline-none focus:border-[#C9A227] text-sm text-[#F7F2EA] placeholder-gray-600 transition-colors text-center font-mono tracking-[0.2em]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#C9A227] hover:bg-[#B08D22] text-[#0E1210] hover:text-[#1a1a1a] font-sans font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>{loading ? "Decrypting Token..." : "Verify Code & Unlock"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCodeVerification(false);
                    setErrorMsg("");
                  }}
                  className="w-full py-2 border border-[#1F3D2F]/30 text-[#757575] hover:text-white hover:bg-[#111413] font-sans text-[10px] uppercase tracking-widest rounded-xl transition-colors text-center cursor-pointer"
                >
                  Back to Password Sign In
                </button>
              </form>
            )
          ) : (
            /* Register Form */
            <form onSubmit={handleAdminRegister} className="space-y-5">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#757575] uppercase tracking-widest">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Sikandar Hayat"
                    className="w-full px-4 py-3 bg-[#111413] border border-[#1F3D2F]/30 rounded-xl outline-none focus:border-[#C9A227] text-sm text-[#F7F2EA] placeholder-gray-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#757575] uppercase tracking-widest">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@wenhairskin.com"
                    className="w-full px-4 py-3 bg-[#111413] border border-[#1F3D2F]/30 rounded-xl outline-none focus:border-[#C9A227] text-sm text-[#F7F2EA] placeholder-gray-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#757575] uppercase tracking-widest">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 bg-[#111413] border border-[#1F3D2F]/30 rounded-xl outline-none focus:border-[#C9A227] text-sm text-[#F7F2EA] placeholder-gray-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#1F4D3A] hover:bg-[#153427] text-[#F7F2EA] hover:text-white font-sans font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4 text-[#C9A227]" />
                <span>{loading ? "Registering Administrative Node..." : "Initiate Administrative profile"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

       
        </div>
      </div>
    </div>
  );
};

export default AdminSignInPage;
