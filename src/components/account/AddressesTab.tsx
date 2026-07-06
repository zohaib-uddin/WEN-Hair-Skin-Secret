import React from "react";
import { Plus, MapPin, Edit2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { AuthInput } from "../shared/AuthInput";

interface AddressesTabProps {
  addresses: any[];
  onAdd: () => void;
  onEdit: (addr: any) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressesTab: React.FC<AddressesTabProps> = ({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-[24px] md:space-y-[32px] font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div>
          <h2 className="font-playfair text-[24px] md:text-[32px] font-bold text-[#1F4D3A] mb-[4px] md:mb-[8px]">
            Saved Addresses
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#6b6b6b]">
            Manage your delivery locations for faster checkout.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="px-[16px] md:px-[20px] py-[10px] md:py-[12px] bg-[#0a0a0a] hover:bg-[#1F4D3A] text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider rounded-lg md:rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-[8px] w-full sm:w-auto"
        >
          <Plus className="w-[16px] md:w-[18px] h-[16px] md:h-[18px]" /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="py-[60px] md:py-[80px] text-center bg-white rounded-[16px] md:rounded-[20px] border-2 border-dashed border-[#e5e5e5] px-[16px]">
          <div className="w-[48px] md:w-[64px] h-[48px] md:h-[64px] bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-[16px] md:mb-[24px]">
            <MapPin className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] text-[#6b6b6b]" />
          </div>
          <h3 className="font-playfair text-[20px] md:text-[24px] font-bold text-[#1a1a1a] mb-[8px]">
            No Addresses Saved
          </h3>
          <p className="text-[14px] md:text-[15px] text-[#6b6b6b] mb-[16px] md:mb-[24px]">
            You haven't saved any delivery addresses yet.
          </p>
          <button
            onClick={onAdd}
            className="px-[20px] md:px-[24px] py-[10px] md:py-[12px] border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider rounded-lg md:rounded-xl transition-colors cursor-pointer"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] md:gap-[24px]">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white p-[16px] md:p-[24px] rounded-[16px] md:rounded-[20px] border-2 transition-all relative ${
                addr.is_primary
                  ? "border-[#1F4D3A] shadow-md"
                  : "border-[#e5e5e5] hover:border-[#C9A227]"
              }`}
            >
              {addr.is_primary && (
                <div className="absolute top-[12px] md:top-[16px] right-[12px] md:right-[16px] bg-[#1F4D3A] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-[8px] md:px-[10px] py-[3px] md:py-[4px] rounded-full">
                  Default
                </div>
              )}
              <h4 className="font-bold text-[15px] md:text-[16px] text-[#1a1a1a] mb-[4px] md:mb-[8px] pr-[60px]">
                {addr.full_name}
              </h4>
              <p className="text-[13px] md:text-[14px] text-[#6b6b6b] mb-[2px] md:mb-[4px]">{addr.phone}</p>
              <p className="text-[13px] md:text-[14px] text-[#6b6b6b] mb-[16px] md:mb-[24px] max-w-[85%]">
                {addr.address}, {addr.city}
                <br />
                {addr.country}
              </p>

              <div className="flex items-center gap-[12px] pt-[12px] md:pt-[16px] border-t border-[#e5e5e5]">
                <button
                  onClick={() => onEdit(addr)}
                  className="flex items-center gap-[4px] md:gap-[6px] text-[12px] md:text-[13px] font-bold text-[#1a1a1a] hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-[12px] md:w-[14px] h-[12px] md:h-[14px]" /> Edit
                </button>
                <div className="w-[1px] h-[12px] md:h-[14px] bg-[#e5e5e5]"></div>
                <button
                  onClick={() => onDelete(addr.id)}
                  className="flex items-center gap-[4px] md:gap-[6px] text-[12px] md:text-[13px] font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-[12px] md:w-[14px] h-[12px] md:h-[14px]" /> Delete
                </button>
                {!addr.is_primary && (
                  <>
                    <div className="w-[1px] h-[12px] md:h-[14px] bg-[#e5e5e5] ml-auto"></div>
                    <button
                      onClick={() => onSetDefault(addr.id)}
                      className="text-[11px] md:text-[12px] font-bold text-[#1F4D3A] hover:underline cursor-pointer ml-auto"
                    >
                      Set Default
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
