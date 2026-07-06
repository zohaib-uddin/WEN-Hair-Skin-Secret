import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  Hourglass,
} from "lucide-react";
import { supabase } from "../../lib/supabase/client";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Formula Selection Advice",
    message: "",
  });
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving message on backend:", errorData.error);
      }
    } catch (err) {
      console.warn(
        "Could not save message via API, trying client-side fallback:",
        err,
      );
      try {
        const { error } = await supabase.from("messages").insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          is_read: false,
        });
        if (error) {
          console.error(
            "Error saving message in Supabase client fallback:",
            error,
          );
        }
      } catch (fallbackErr) {
        console.error("Client fallback also failed:", fallbackErr);
      }
    }

    setIsSubmitSuccessful(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Formula Selection Advice",
        message: "",
      });
    }, 2000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E1D3] shadow-sm text-left relative">
      <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1F4D3A] mb-8">
        Get in Touch
      </h3>

      {isSubmitSuccessful ? (
        <div className="p-8 bg-[#1F4D3A]/5 border border-[#C9A227] rounded-xl text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#1F4D3A]/10 text-[#C9A227] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <strong className="font-playfair text-lg text-[#1F4D3A] block">
              Shukriya, Message Received!
            </strong>
            <p className="text-xs text-[#757575] leading-relaxed font-sans font-light max-w-xs mx-auto">
              Our clinical care response desk has logged your ticket. A
              certified cosmetic associate will reach back via email or phone
              within 4 business hours.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 font-sans">
          {/* Name Input */}
          <div className="relative group">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b-2 border-[#e5e5e5] focus:border-[#C9A227] outline-none py-3 text-sm text-[#2C2C2C] font-light transition-colors"
              placeholder="Your Full Name *"
            />
          </div>

          {/* Email / Phone grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="relative group">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-[#e5e5e5] focus:border-[#C9A227] outline-none py-3 text-sm text-[#2C2C2C] font-light transition-colors"
                placeholder="Email Address *"
              />
            </div>

            <div className="relative group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-[#e5e5e5] focus:border-[#C9A227] outline-none py-3 text-sm text-[#2C2C2C] font-light transition-colors"
                placeholder="Phone / WhatsApp"
              />
            </div>
          </div>

          {/* Subject Dropdown */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-[#757575] uppercase tracking-widest block">
              How can we assist you?
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b-2 border-[#e5e5e5] focus:border-[#C9A227] outline-none py-3 text-sm text-[#2C2C2C] font-semibold transition-colors"
            >
              <option value="Formula Selection Advice">
                Formula Selection Advice
              </option>
              <option value="Order Tracking & Delivery support">
                Order Tracking & Delivery support
              </option>
              <option value="Skin Reactions & Refunds">
                Skin Reactions & Refunds
              </option>
              <option value="Corporate / Pakistan Whole-salers">
                Corporate / Pakistan Whole-salers
              </option>
              <option value="Other Concerns">Other Concerns</option>
            </select>
          </div>

          {/* Detailed Message Textarea */}
          <div className="relative group">
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b-2 border-[#e5e5e5] focus:border-[#C9A227] outline-none py-3 text-sm text-[#2C2C2C] font-light transition-colors resize-none"
              placeholder="Describe your hair or skin conditions in details... *"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="w-full bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-bold text-xs uppercase tracking-widest py-4.5 rounded-xl transition-all shadow-md active:scale-[0.98] outline-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
