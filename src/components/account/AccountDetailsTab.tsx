import React, { useState } from "react";
import { User, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { AuthInput } from "../shared/AuthInput";

interface AccountDetailsTabProps {
  userDetails: any;
  onUpdate: (details: any) => Promise<void>;
}

export const AccountDetailsTab: React.FC<AccountDetailsTabProps> = ({
  userDetails,
  onUpdate,
}) => {
  const [fullName, setFullName] = useState(userDetails.fullName || "");
  const [phone, setPhone] = useState(userDetails.phone || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await onUpdate({ fullName, phone });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-[24px] md:space-y-[32px] font-sans max-w-[600px]"
    >
      <div>
        <h2 className="font-playfair text-[24px] md:text-[32px] font-bold text-[#1F4D3A] mb-[4px] md:mb-[8px]">
          Account Details
        </h2>
        <p className="text-[14px] md:text-[15px] text-[#6b6b6b]">
          View and update your personal information.
        </p>
      </div>

      <div className="bg-white border-2 border-[#e5e5e5] rounded-[16px] md:rounded-[20px] p-[20px] md:p-[32px] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-[20px] md:space-y-[24px]">
          <div className="space-y-[12px] md:space-y-[16px]">
            <h3 className="font-playfair text-[18px] md:text-[20px] font-bold text-[#1a1a1a]">
              Personal Information
            </h3>
            
            <AuthInput
              label="Full Name"
              type="text"
              id="details-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <AuthInput
              label="Email Address"
              type="email"
              id="details-email"
              value={userDetails.email || ""}
              onChange={() => {}}
              disabled
            />

            <AuthInput
              label="Phone Number"
              type="tel"
              id="details-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="pt-[20px] md:pt-[24px] border-t border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center gap-[12px] md:gap-[16px]">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-[24px] md:px-[32px] py-[12px] md:py-[14px] bg-[#0a0a0a] hover:bg-[#1F4D3A] text-white text-[13px] md:text-[14px] font-bold uppercase tracking-wider rounded-lg md:rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {success && (
              <span className="text-[#10b981] text-[13px] md:text-[14px] font-bold flex items-center justify-center sm:justify-start gap-[6px]">
                <ShieldCheck className="w-[14px] md:w-[16px] h-[14px] md:h-[16px]" /> Saved Successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};
