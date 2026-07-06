import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { Sparkles, Heart } from "lucide-react";
import beautyModelImg from "../../assets/images/beauty_model_portrait_1782223879032.jpg";
import modelHandImg from "../../assets/images/skincare_model_hand_1782223899435.jpg";

interface CinematicCharacterProps {
  scrollProgress?: any;
}

export const CinematicCharacter: React.FC<CinematicCharacterProps> = ({
  scrollProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  // Fallback to local scroll progression if parent timeline is not passed
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const activeProgress = scrollProgress || scrollYProgress;
  const smoothScroll = useSpring(activeProgress, {
    stiffness: 45,
    damping: 20,
  }) as any;

  // 1. CHARACTER ENTRANCE & MASTER SCROLL CHOREOGRAPHY (Instruction 1, 2 & 4)
  // From 0% to 25%: Character walks in from the right edge smoothly towards center (Walk cycle simulation)
  const characterX = useTransform(smoothScroll, [0, 0.25], [110, 0]);
  const characterOpacity = useTransform(smoothScroll, [0, 0.25], [0, 1]);
  // Use a softer scale up for photorealistic high-end feel
  const characterScale = useTransform(
    smoothScroll,
    [0, 0.3, 0.9, 1],
    [0.93, 1, 0.95, 0.9],
  );
  const characterY = useTransform(
    smoothScroll,
    [0, 0.3, 0.9, 1],
    [40, 0, -20, -60],
  );

  // CLINICAL CAMERA FOCUS RACK (Depth of Field Pull) (Instruction 6)
  // Product is main focus first, so girl is blurred (5px). Racks into sharp focal focus (0px) when hand extends
  const focusBlur = useTransform(
    smoothScroll,
    [0, 0.22, 0.38, 0.85, 1],
    ["blur(5.5px)", "blur(4px)", "blur(0px)", "blur(0px)", "blur(1.5px)"],
  );

  // DIGITAL CAMERA "PAN" EFFECT (Instruction 2)
  // Moving the container in the opposite direction of the main motion to create depth parallax
  const cameraPanX = useTransform(smoothScroll, [0, 0.35], [-16, 16]);

  // INSTANTANEOUS MICRO-CAMERA VIBRATING SHAKE (Tactile drop impact) (Instruction 4)
  // Multi-step rapid 2px camera vibration triggered EXACTLY during splash contact frame (0.40 - 0.45)
  const cameraShakeX = useTransform(
    smoothScroll,
    [0.38, 0.39, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45],
    [0, 2.5, -2.5, 2.2, -1.8, 1.2, -0.6, 0],
  );

  // 2. ULTRA-SMOOTH HAND MOVEMENT TIMELINE (Instruction 1 & 5)
  // At 20%: Character hand enters from bottom right.
  // At 40%-48%: Intercepts serum drop & triggers splash.
  // At 52%-68%: Moves to touch the face and activate the bioactive saffron glow.
  // At 70%+ : Gracefully retreats.
  const handOpacity = useTransform(
    smoothScroll,
    [0.18, 0.23, 0.68, 0.74],
    [0, 1, 1, 0],
  );

  // Hand moves from off-screen bottom-right to middle-left to catch droplets, then moves to cheek, then retreats
  const handX = useTransform(
    smoothScroll,
    [0.15, 0.42, 0.52, 0.72],
    [140, -45, -2, 160],
  );
  const handY = useTransform(
    smoothScroll,
    [0.15, 0.42, 0.52, 0.72],
    [180, 20, -50, 150],
  );
  const handRotate = useTransform(
    smoothScroll,
    [0.15, 0.42, 0.52, 0.72],
    [45, -15, -45, 15],
  );
  const handScale = useTransform(
    smoothScroll,
    [0.15, 0.42, 0.52, 0.72],
    [0.85, 1.05, 0.95, 0.75],
  );

  // 3. PHOTOREACTIVE BIOACTIVE SAFFRON SKIN GLOW (Instruction 5)
  // Skin glow is triggered as hand contacts the cheek (index 0.52 to 0.68)
  const skinGlowOpacity = useTransform(
    smoothScroll,
    [0.48, 0.54, 0.68, 0.76],
    [0, 0.95, 0.75, 0],
  );
  const skinGlowIntensity = useTransform(smoothScroll, [0.52, 0.6], [1, 1.3]);

  // CINEMATIC SOFT GOLDEN LENS FLARE (Instruction 5 & 6)
  // Flare sweeps horizontally across her cheek/face right as skin hydration peaks
  const flareX = useTransform(smoothScroll, [0.52, 0.68], ["-130%", "230%"]);
  const flareOpacity = useTransform(
    smoothScroll,
    [0.52, 0.55, 0.63, 0.68],
    [0, 0.85, 0.85, 0],
  );

  // FLOATING GOLDEN LIGHT LEAKS (Instruction 6)
  const lightLeakTranslateY = useTransform(smoothScroll, [0, 1], [-80, 80]);
  const lightLeakScale = useTransform(
    smoothScroll,
    [0, 0.5, 1],
    [0.9, 1.3, 0.95],
  );
  const lightLeakOpacity = useTransform(
    smoothScroll,
    [0.1, 0.55, 0.9],
    [0.1, 0.4, 0.15],
  );

  // Interactive local states for catching mechanics
  const [hasCaughtDrop, setHasCaughtDrop] = useState(false);
  const [cheekRippleActive, setCheekRippleActive] = useState(false);
  const [absorptionPulse, setAbsorptionPulse] = useState(false);

  // Monitor status updates from master timeline progress callback
  useEffect(() => {
    return (smoothScroll as any).on("change", (latestValue: any) => {
      const val = Number(latestValue);
      // Catch drop phase [0.40 - 0.48]
      if (val >= 0.4 && val <= 0.49) {
        if (!hasCaughtDrop) {
          setHasCaughtDrop(true);
          setAbsorptionPulse(true);
          setTimeout(() => setAbsorptionPulse(false), 800);
        }
      } else if (val < 0.38) {
        setHasCaughtDrop(false);
      }

      // Touch cheek & face absorption ripple phase [0.50 - 0.68]
      if (val >= 0.5 && val <= 0.68) {
        if (!cheekRippleActive) {
          setCheekRippleActive(true);
        }
      } else {
        setCheekRippleActive(false);
      }
    });
  }, [smoothScroll, hasCaughtDrop, cheekRippleActive]);

  // Resize and Viewport Observer for graceful degradation
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  const isMobile = windowWidth < 768;

  // Combine Walk-In (characterX), Camera Pan (cameraPanX), and Micro-Camera vibration (cameraShakeX) (Instruction 2 & 4 & 5)
  const combinedX = useTransform(
    [characterX, cameraPanX, cameraShakeX],
    ([xVal, panVal, shakeVal]) =>
      Number(xVal) + Number(panVal) + Number(shakeVal),
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5] lg:aspect-[6/7] flex items-center justify-center pointer-events-none select-none overflow-visible"
      id="cinematic-character-block"
    >
      {/* 4. GPU-ACCELERATED ACCENTUATED WRAPPER FRAME (Instruction 6) */}
      <motion.div
        style={{
          opacity: isMobile ? 1 : characterOpacity,
          scale: isMobile ? 1 : characterScale,
          x: isMobile ? 0 : combinedX,
          y: isMobile ? 0 : characterY,
          willChange: "transform, opacity",
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full max-w-[390px] flex items-center justify-center overflow-visible"
      >
        {/* Soft studio golden reflection back-light halo */}
        <div className="absolute inset-x-0 bottom-0 top-[15%] bg-gradient-to-t from-[#C9A227]/18 via-[#1F4D3A]/6 to-transparent rounded-full blur-[45px] sm:blur-[60px] z-0 animate-pulse" />

        {/* Drifting Golden Light Leaks (Instruction 6) */}
        {!isMobile && (
          <>
            <motion.div
              style={{
                y: lightLeakTranslateY,
                scale: lightLeakScale,
                opacity: lightLeakOpacity,
                willChange: "transform, opacity",
              }}
              className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-radial from-[#C9A227]/30 to-transparent blur-[50px] pointer-events-none z-0 mix-blend-screen"
            />
            <motion.div
              style={{
                y: useTransform(smoothScroll, [0, 1], [80, -80]),
                scale: useTransform(smoothScroll, [0, 1], [1.2, 0.9]),
                opacity: useTransform(
                  smoothScroll,
                  [0, 0.5, 1],
                  [0.1, 0.35, 0.05],
                ),
                willChange: "transform, opacity",
              }}
              className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-radial from-[#C9A227]/25 to-transparent blur-[60px] pointer-events-none z-0 mix-blend-screen"
            />
          </>
        )}

        {/* MODERN CAMPAIGN PORTRAIT FRAME with clean professional margins & focus rack blur */}
        <motion.div
          style={{
            filter: isMobile ? "none" : focusBlur,
            willChange: "filter",
          }}
          className="relative w-full aspect-[3/4.2] rounded-[36px] overflow-hidden border border-[#E9E4DB]/80 shadow-[0_24px_50px_rgba(27,24,20,0.18)] bg-stone-100 z-10"
        >
          {/* Main photorealistic high-fidelity beauty presentation */}
          <img
            src={beautyModelImg}
            alt="Wen Luxury Campaign Face Model Portrait"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{ imageRendering: "auto" }}
            loading="lazy"
          />

          {/* VIBRANT GLOW MATRIX (Saffron bioactive activation overlay) (Instruction 3 & 5) */}
          <motion.div
            style={{
              opacity: isMobile ? 0.15 : skinGlowOpacity,
              willChange: "opacity",
            }}
            className="absolute inset-0 bg-gradient-to-tr from-[#C9A227]/22 via-rose-300/15 to-transparent mix-blend-color-dodge pointer-events-none z-15"
          />

          {/* Golden radial light-burst spot on cheekbones highlighting the clinical treatment (Instruction 5) */}
          <motion.div
            style={{
              opacity: isMobile ? 0.3 : skinGlowOpacity,
              scale: isMobile ? 1 : skinGlowIntensity,
              willChange: "opacity, transform",
            }}
            className="absolute left-[22%] top-[54%] w-32 h-32 rounded-full bg-radial from-[#FFF3D1]/75 via-[#C9A227]/35 to-transparent blur-md mix-blend-screen pointer-events-none z-20"
          />

          {/* Cinematic Lens Flare Sweep across her face (Instruction 5 & 6) */}
          <motion.div
            style={{
              x: flareX,
              opacity: flareOpacity,
              willChange: "transform, opacity",
            }}
            className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white/55 to-transparent skew-x-[-20deg] pointer-events-none z-25 mix-blend-screen"
          />

          {/* Beautiful subtle warm overlay matching skin tones */}
          <div className="absolute inset-0 bg-[#C9A227]/5 mix-blend-overlay pointer-events-none" />

          {/* Dynamic golden cosmetic ripples emanating from point of contact (Instruction 5) */}
          <AnimatePresence>
            {cheekRippleActive && (
              <div className="absolute left-[38%] top-[58%] -translate-x-1/2 -translate-y-1/2 overflow-visible pointer-events-none z-20">
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.95 }}
                  animate={{ scale: 4.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="w-12 h-12 rounded-full border border-[#C29D29] shadow-[0_0_12px_rgba(194,157,41,0.5)]"
                />
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.6,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="w-12 h-12 rounded-full border border-white/60"
                />
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 5. SEPARATELY DECLARED PHOTOREALISTIC HAND LAYER FOR DYNAMIC TRACKING INTERACTION (Instruction 5) */}
        <motion.div
          style={
            isMobile
              ? {
                  x: 70,
                  y: 80,
                  rotate: 15,
                  scale: 0.85,
                  opacity: 0.9,
                }
              : {
                  x: handX,
                  y: handY,
                  rotate: handRotate,
                  scale: handScale,
                  opacity: handOpacity,
                  willChange: "transform, opacity",
                  transformStyle: "preserve-3d",
                }
          }
          className="absolute right-0 bottom-0 w-[170px] sm:w-[220px] aspect-square z-30 pointer-events-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.22)]"
          id="photorealistic-model-hand"
        >
          <img
            src={modelHandImg}
            alt="Model Graceful Hand"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
            loading="lazy"
          />

          {/* Droplet Landing Splash Ripple directly on fingertips during contact range (Instruction 3 & 5) */}
          <AnimatePresence>
            {hasCaughtDrop && (
              <div className="absolute left-[38%] top-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-35">
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.95 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.9 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 rounded-full bg-[#C9A227]/40 blur-xs"
                />
                {/* Floating sparkle dust */}
                <motion.div
                  initial={{ y: 0, opacity: 1, scale: 0.5 }}
                  animate={{
                    y: [-15, -35],
                    opacity: [1, 0],
                    scale: [0.5, 1.2],
                  }}
                  transition={{ duration: 0.7 }}
                  className="absolute left-1/2 -translate-x-1/2 text-yellow-300"
                >
                  <Sparkles className="w-4 h-4 fill-yellow-200" />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ambient surrounding stars sparkles for high-end feel */}
        <div className="absolute inset-0 pointer-events-none overflow-visible z-20 opacity-60">
          <Sparkles className="absolute left-[5%] top-[12%] w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <Sparkles className="absolute right-[8%] top-[35%] w-3 h-3 text-white animate-pulse" />
          <div className="absolute left-[15%] bottom-[15%] w-2 h-2 rounded-full bg-[#C9A227] animate-ping" />
        </div>
      </motion.div>
    </div>
  );
};

export default CinematicCharacter;
