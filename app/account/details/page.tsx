"use client";

import React, { useState, useEffect } from "react";
import { Check, ShieldCheck, Key } from "lucide-react";
import { useShop } from "../../../src/context/ShopContext";

export default function AccountDetailsPage() {
  const { profile, user, updateProfile, triggerToast } = useShop();

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("Lahore");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCity(profile.city || "Lahore");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
    } else if (user) {
      setFullName(user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
      setPhone(user.primaryPhoneNumber?.phoneNumber || "");
    }
  }, [profile, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateProfile({
        fullName,
        city,
        phone
      });

      if (result.success) {
        setIsSavedAlert(true);
        triggerToast("Profile details updated successfully!");

        // Update custom sidebar display label dynamically in DOM if present
        const lbl = document.getElementById("auth-sidebar-username-lbl");
        if (lbl) lbl.innerText = fullName;

        setTimeout(() => setIsSavedAlert(false), 3000);
      } else {
        triggerToast(result.error || "Failed to update profile details.");
      }
    } catch (err: any) {
      triggerToast("Error updating profile: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" id="account-details-view">
      {/* Header Info */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A227] uppercase font-bold block mb-2">
          Private Credentials Security
        </span>
        <h1 className="font-playfair text-3xl font-extrabold text-[#1F4D3A] tracking-wider uppercase">
          Profile Details
        </h1>
        <p className="text-xs text-gray-500 font-light mt-1 max-w-2xl leading-relaxed">
          Update custom registered credentials, cellular receipt networks, and private apothecary access pass-keys.
        </p>
      </div>

      {isSavedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4.5 h-4.5 text-emerald-650" /> Credentials stored safely in server registry!
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl pt-4">
        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#1F4D3A] uppercase tracking-wider font-sans">
              Full Legal Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none text-xs font-light"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#1F4D3A] uppercase tracking-wider font-sans">
              Primary City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none text-xs font-light"
              required
            />
          </div>
        </div>

        {/* Locked values */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#1F4D3A] uppercase tracking-wider font-sans text-gray-400">
            Registered Email address (Locked Sanctum Account)
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-150 bg-gray-50 outline-none text-xs text-gray-400 font-mono cursor-not-allowed"
          />
          <p className="text-[9px] text-gray-400 font-light font-sans mt-1">
            To update registered email nodes, please raise an inquiry channel with our beauty consultants.
          </p>
        </div>

        {/* Contact information */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#1F4D3A] uppercase tracking-wider font-sans">
            Registered phone (WhatsApp logistic updates)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none text-xs font-light"
            required
          />
        </div>

        {/* Password update segment */}
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-[#1F4D3A]">
            <Key className="w-4.5 h-4.5 text-[#C9A227]" />
            <span className="text-[11px] font-black uppercase tracking-wider font-sans">
              Change Secret Pass Key
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#1F4D3A] uppercase tracking-wider font-sans">
                Current Pass Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none text-xs font-light"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#1F4D3A] uppercase tracking-wider font-sans">
                New Pass Key Formulation
              </label>
              <input
                type="password"
                placeholder="Insert highly secure pass key"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none text-xs font-light"
              />
            </div>
          </div>
        </div>

        {/* Action button: Save changes (Gold bg, Dark Green text) */}
        <button
          type="submit"
          className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#b08d20] text-[#1F4D3A] text-xs font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
