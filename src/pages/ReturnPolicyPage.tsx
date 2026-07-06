import React from 'react';

export const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="pt-[140px] pb-[80px] bg-[#f9f9f9] min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-10 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-playfair font-bold text-[#1F4D3A] mb-8">Return Policy</h1>
        <div className="prose prose-sm md:prose-base text-gray-700">
          <p className="mb-4">We want you to be completely satisfied with your purchase from WEN Hair & Skin Secret.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#1a1a1a]">Returns</h2>
          <p className="mb-4">If you receive a damaged or incorrect product, you have 7 days to request a return or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#1a1a1a]">Refunds</h2>
          <p className="mb-4">Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
        </div>
      </div>
    </div>
  );
};
