"use client";

import React, { useState } from "react";
import { MapPin, Plus, Trash2, Edit2, ShieldAlert, Check } from "lucide-react";
import { useShop } from "../../../src/context/ShopContext";

export default function AccountAddressesPage() {
  const { savedAddresses, addAddress, deleteAddress, setPrimaryAddress, triggerToast } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("Lahore");
  const [makeDefault, setMakeDefault] = useState(false);

  const handleSetDefault = async (id: string) => {
    try {
      const res = await setPrimaryAddress(id);
      if (res.success) {
        triggerToast("Primary address updated successfully!");
      } else {
        triggerToast("Failed to set primary address.");
      }
    } catch (err: any) {
      triggerToast("Error updating default address: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const toDelete = savedAddresses.find(a => a.id === id);
      if (toDelete?.is_primary) {
        triggerToast("Please appoint a different Default address first before discarding this formulation coordinate.");
        return;
      }
      if (confirm("Are you sure you want to delete this saved address?")) {
        const res = await deleteAddress(id);
        if (res.success) {
          triggerToast("Address removed successfully!");
        } else {
          triggerToast("Failed to delete address.");
        }
      }
    } catch (err: any) {
      triggerToast("Error deleting address: " + (err.message || "Unknown error"));
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newFullName || !newPhone || !newAddressLine) return;

    try {
      const res = await addAddress({
        full_name: newFullName,
        phone: newPhone,
        address: newAddressLine,
        city: newCity,
        country: "Pakistan",
        special_instructions: newLabel,
        is_primary: makeDefault
      });

      if (res.success) {
        triggerToast("Address saved to database successfully!");
        // Reset controls
        setNewLabel("");
        setNewFullName("");
        setNewPhone("");
        setNewAddressLine("");
        setNewCity("Lahore");
        setMakeDefault(false);
        setIsModalOpen(false);
      } else {
        triggerToast("Failed to add address.");
      }
    } catch (err: any) {
      triggerToast("Error adding address: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" id="account-addresses-view">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A227] uppercase font-bold block mb-2">
            Target Logistics Coordinates
          </span>
          <h1 className="font-playfair text-3xl font-extrabold text-[#1F4D3A] tracking-wider uppercase">
            Saved Addresses
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            Pre-configure geographical dropoff nodes for rapid, gold-circle checkout routines.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2.5 bg-[#1F4D3A] hover:bg-[#153427] text-white text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>Add New Coordinates</span>
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {savedAddresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white border rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 ${
              addr.is_primary
                ? "border-[#C9A227] bg-[#C9A227]/5"
                : "border-gray-150 hover:border-[#1F4D3A]/20 hover:shadow-sm"
            }`}
          >
            <div>
              {/* Default Badge */}
              {addr.is_primary ? (
                <span className="absolute top-4 right-4 bg-[#C9A227] text-[#1F4D3A] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                  ★ Default Target
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="absolute top-4 right-4 text-[9px] text-[#C9A227] font-bold uppercase tracking-widest bg-white border border-gray-100 px-2.5 py-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Set Default
                </button>
              )}

              {/* Title label */}
              <div className="flex items-center gap-2 text-[#1F4D3A] mb-4">
                <MapPin className="w-4.5 h-4.5 text-[#C9A227]" />
                <h4 className="text-xs font-black uppercase tracking-wider font-sans">{addr.special_instructions || "Saved Location"}</h4>
              </div>

              {/* Text fields */}
              <div className="text-xs space-y-1 text-gray-600 font-light leading-relaxed">
                <p className="font-semibold text-gray-900">{addr.full_name}</p>
                <p className="font-mono text-[11px]">{addr.phone}</p>
                <p>{addr.address}</p>
                <p>
                  {addr.city}, {addr.country || "Pakistan"}
                </p>
              </div>
            </div>

            {/* Actions Footer row */}
            <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-end gap-3.5">
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="text-rose-600 hover:text-rose-800 text-[10.5px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}

        {/* Dashed placeholder for Add New address */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-gray-200 hover:border-[#1F4D3A]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group min-h-[190px]"
        >
          <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#1F4D3A]/5 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#1F4D3A] transition-all mb-3.5 border">
            <Plus className="w-6 h-6 text-[#C9A227]" />
          </div>
          <p className="text-xs font-bold text-gray-500 group-hover:text-[#1F4D3A] uppercase tracking-wider">
            Add New Core Address
          </p>
          <p className="text-[10px] text-gray-400 font-light">Specify an alternate shipping location.</p>
        </div>
      </div>

      {/* Add New Coordinates Dialog Overlay Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E8E1D3] rounded-3xl p-6 sm:p-8 w-full max-w-md text-left shadow-2xl animate-scale-up space-y-5">
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#1F4D3A] uppercase tracking-wider">
                Add Core Location
              </h2>
              <p className="text-[10px] text-gray-400 font-light mt-1">
                Pin geographic configurations for instant batch logistics.
              </p>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1F4D3A] uppercase tracking-widest block">
                  Location Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office, Farmhouse"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none font-light"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1F4D3A] uppercase tracking-widest block">
                  Consignee Legal Name
                </label>
                <input
                  type="text"
                  placeholder="Recipient full name"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none font-light"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#1F4D3A] uppercase tracking-widest block">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none font-light font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#1F4D3A] uppercase tracking-widest block">
                    Select City
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white font-light text-gray-700"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1F4D3A] uppercase tracking-widest block">
                  Full Street Address Detailing
                </label>
                <input
                  type="text"
                  placeholder="House number, phase, block, street, road, landmark"
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none font-light"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="make-default-addr"
                  checked={makeDefault}
                  onChange={(e) => setMakeDefault(e.target.checked)}
                  className="rounded border-[#E8E1D3] text-[#1F4D3A] focus:ring-[#C9A227] w-4.5 h-4.5 cursor-pointer"
                />
                <label
                  htmlFor="make-default-addr"
                  className="text-[10px] text-gray-500 font-sans tracking-wide cursor-pointer select-none"
                >
                  Make this my default premium delivery coordinate.
                </label>
              </div>

              <div className="pt-4 flex gap-3 text-xs uppercase font-bold tracking-wider">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 text-center transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#1F4D3A] hover:bg-[#153427] text-white rounded-xl text-center transition-colors cursor-pointer"
                >
                  Affix Coordinate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
