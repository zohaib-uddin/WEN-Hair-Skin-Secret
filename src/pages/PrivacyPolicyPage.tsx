import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-[140px] pb-[80px] bg-[#f9f9f9] min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-10 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-playfair font-bold text-[#1F4D3A] mb-8">Privacy Policy</h1>
        <div className="prose prose-sm md:prose-base text-gray-700">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mb-4">At WEN Hair & Skin Secret, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#1a1a1a]">Information We Collect</h2>
          <p className="mb-4">We may collect personal information that you voluntarily provide to us when registering at the site, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us. The personal information we collect depends on the context of your interactions with us and the site.</p>
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#1a1a1a]">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect or receive to facilitate account creation and logon process, to send you marketing and promotional communications, and to fulfill and manage your orders.</p>
        </div>
      </div>
    </div>
  );
};
