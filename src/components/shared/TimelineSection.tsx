import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import img1 from "../../assets/images/wen 10.png";
import img2 from "../../assets/images/wen 11.png";
import img3 from "../../assets/images/wen 12.png";
import img4 from "../../assets/images/wen 13.png";
import img5 from "../../assets/images/wen 14.png";
import img6 from "../../assets/images/wen 15.png";


interface TimelineMilestone {
  day: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

export const TimelineSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string>("30");

  const milestones: TimelineMilestone[] = [
    {
      day: "30",
      title: "Reduced Hair Fall & Healthier Scalp",
      description:
        "During the first month, active Kashmir Saffron bio-compounds clean residual synthetic wax and paraben layers off the hair shaft and follicles. Botanical nutrients nourish cells, initiating heavy follicular root recovery.",
      beforeImage:
        img1,
      afterImage:
        img2,
    },
    {
      day: "60",
      title: "Visible New Growth & Thickness Spike",
      description:
        "Dormant follicle cells trigger active growth signals. You will notice high volumes of tiny micro-baby hair follicles populating the frontal hairline and vertex regions, while original stems solidify.",
      beforeImage:
        img3,
      afterImage:
        img4,
    },
    {
      day: "90",
      title: "Full, Luxurious & Radiant Hair Density",
      description:
        "Fully rehabilitated hair follicles complete their growth cycles. Stems are now thicker, displaying natural shiny luster, high structural volume, and supreme bounce back against external sun tanning or humidity.",
      beforeImage:
        img5,
      afterImage:
        img6,
    },
  ];

  const currentMilestone =
    milestones.find((m) => m.day === activeDay) || milestones[0];

  return (
    <section
      className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#F4EBDB] font-sans"
      id="proven-results-section"
    >
      <div className="max-w-[1280px] mx-auto px-[24px]">
        {/* Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[80px] items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-[32px]"
          >
            <div>
              <div className="w-[40px] h-[2px] bg-[#B69355] mb-[8px] md:mb-[12px]" />
              <span className="text-[#B69355] text-[9px] md:text-[11px] font-bold tracking-[3px] uppercase block mb-[8px] md:mb-[12px]">
                Proven Results
              </span>
              <h2 className="font-playfair text-[24px] md:text-[36px] font-bold text-[#254936] tracking-[-0.01em]">
                Your Journey to <br className="hidden lg:block" /> Healthier
                Hair & Skin
              </h2>
              <p className="text-[11px] md:text-[14px] text-[#63786A] leading-[1.6] mt-[8px] md:mt-[12px] max-w-[400px]">
                Watch real transformations unfold as our clinical botanical
                ingredients repair, strengthen, and nourish your hair and skin from the
                roots up.
              </p>
            </div>

            {/* Day Timeline Buttons */}
            <div className="flex gap-[8px] md:gap-[16px]">
              {milestones.map((m) => (
                <button
                  key={m.day}
                  onClick={() => setActiveDay(m.day)}
                  className={`flex-1 py-[10px] md:py-[12px] px-[8px] md:px-[16px] rounded-xl text-[10px] md:text-[12px] font-bold tracking-[1px] uppercase transition-all duration-300 outline-none border ${
                    activeDay === m.day
                      ? "bg-[#254936] text-white border-[#254936]"
                      : "bg-white text-[#254936] border-[#E0D4BE] hover:border-[#254936]"
                  }`}
                >
                  Day {m.day}
                </button>
              ))}
            </div>

            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-playfair text-[18px] md:text-[24px] font-bold text-[#254936] mb-[8px] md:mb-[12px]">
                  {currentMilestone.title}
                </h3>
                <p className="text-[11px] md:text-[14px] text-[#63786A] leading-[1.6] max-w-[500px] mb-[16px] md:mb-[24px]">
                  {currentMilestone.description}
                </p>
                <button className="bg-[#254936] text-white font-bold text-[10px] md:text-[12px] uppercase tracking-[1px] px-[24px] md:px-[32px] py-[12px] md:py-[16px] rounded-xl hover:bg-[#B69355] transition-colors outline-none inline-block">
                  Shop The Growth Kit
                </button>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: Before/After image comparison slider */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <BeforeAfterSlider
              beforeImage={currentMilestone.beforeImage}
              afterImage={currentMilestone.afterImage}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
