import React from "react";
import { Leaf, Shield, Award, Truck, Wallet } from "lucide-react";
import { motion } from "motion/react";

interface FeatureItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

export const WhyChooseUs: React.FC = () => {
  const feats: FeatureItem[] = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "Harnesses Kashmir Saffron and pure botanical essences.",
    },
    {
      icon: Shield,
      title: "Toxin Assured",
      description: "Proudly free of unverified chemicals, parabens, & dyes.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Scientifically balanced pH 5.5 to shield against hard tap salt.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Direct to your doorstep anywhere in Pakistan in 2-4 days.",
    },
    {
      icon: Wallet,
      title: "COD Available",
      description: "Pay upon physical delivery and real door inspection.",
    },
  ];

  return (
    <section
      className="bg-[#F7F2EA] py-[40px] md:py-[60px] lg:py-[80px] font-sans"
      id="why-choose-us-section"
    >
      <div className="max-w-[1280px] mx-auto px-[16px] md:px-[24px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px] mx-auto mb-[32px] md:mb-[40px] flex flex-col items-center"
        >
          <div className="w-[40px] h-[2px] bg-[#C9A227] mb-[8px] md:mb-[12px]" />
          <span className="text-[#C9A227] text-[9px] md:text-[11px] font-bold tracking-[3px] uppercase block mb-[8px] md:mb-[12px]">
            The Wen Difference
          </span>
          <h2 className="font-playfair text-[24px] md:text-[36px] font-bold text-[#1F4D3A] tracking-[-0.01em]">
            Why Choose Us
          </h2>
          <p className="text-[11px] md:text-[14px] text-[#6b6b6b] leading-[1.6] mt-[8px] md:mt-[12px] max-w-[400px]">
            Experience the luxury of natural beauty, crafted meticulously for
            your well-being.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[20px] md:gap-[32px]">
          {feats.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="w-full"
              >
                <div
                  className="bg-transparent flex flex-col items-center text-center group cursor-default"
                  id={`why-choose-us-card-${feat.title.toLowerCase().replace(/ /g, "-")}`}
                >
                  {/* Luxury Icon Container */}
                  <div className="w-[48px] md:w-[56px] h-[48px] md:h-[56px] rounded-full border border-[#1F4D3A]/20 flex items-center justify-center transition-colors duration-500 group-hover:border-[#C9A227]">
                    <IconComponent
                      className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] text-[#1F4D3A] transition-colors duration-500 group-hover:text-[#C9A227]"
                      strokeWidth={1}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-sans font-bold text-[12px] md:text-[14px] text-[#1a1a1a] mt-[16px] md:mt-[24px] mb-[6px] md:mb-[8px] tracking-[0.5px]">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-[11px] md:text-[13px] text-[#6b6b6b] leading-[1.5] md:leading-[1.6] max-w-[160px] md:max-w-none">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
