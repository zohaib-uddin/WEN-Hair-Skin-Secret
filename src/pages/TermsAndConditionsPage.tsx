import React from 'react';

export const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="pt-[140px] pb-[80px] bg-gradient-to-b from-[#F4EBDB]/40 to-white min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-10 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-playfair font-bold text-[#254936] mb-8">Terms and Conditions</h1>
        <div className="prose prose-sm md:prose-base text-gray-700">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mb-4">Please read these Terms and Conditions carefully before using our website operated by WEN Hair & Skin Secret.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#254936]">Conditions of Use</h2>
          <p className="mb-4">By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#254936]">Intellectual Property</h2>
          <p className="mb-4">You agree that all materials, products, and services provided on this website are the property of WEN Hair & Skin Secret, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property.</p>
        </div>
      </div>
    </div>
  );
};
