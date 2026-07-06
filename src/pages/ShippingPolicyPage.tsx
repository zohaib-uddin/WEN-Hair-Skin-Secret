import React from 'react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="pt-[140px] pb-[80px] bg-[#f9f9f9] min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-10 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-playfair font-bold text-[#1F4D3A] mb-8">Shipping Policy</h1>
        <div className="prose prose-sm md:prose-base text-gray-700">
          <p className="mb-4">At WEN Hair & Skin Secret, our goal is to offer you the best shipping options, no matter where you live in Pakistan. Every day, we deliver to hundreds of customers across the country, ensuring that we provide the highest levels of responsiveness to you at all times.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#1a1a1a]">Processing Time</h2>
          <p className="mb-4">Order verification, tailoring, quality check, and packaging. All orders are sent to the dispatch center for dispatch within 24 hours after the order is placed.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#1a1a1a]">Shipping Time</h2>
          <p className="mb-4">This refers to the time it takes for items to be shipped from our warehouse to the destination. Delivery typically takes about 2–4 business days within major cities, and up to 5 business days for remote areas.</p>
        </div>
      </div>
    </div>
  );
};
