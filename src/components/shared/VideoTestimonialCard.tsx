import React, { useRef, useState } from "react";
import { Play, Pause, Star, Quote, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";

interface VideoTestimonialCardProps {
  name: string;
  city: string;
  avatar: string;
  reviewText: string;
  videoUrl?: string; // fallback if dynamic video loaded
  imageUrl: string; // luxurious placeholder frame
  rating: number;
}

export const VideoTestimonialCard: React.FC<VideoTestimonialCardProps> = ({
  name,
  city,
  avatar,
  reviewText,
  videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-hair-shining-in-the-sunlight-extreme-close-up-42031-large.mp4", // default glowing hair looping stock
  imageUrl,
  rating,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Handle autoplay block
        });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.025, transition: { duration: 0.3 } }}
      className="flex-shrink-0 w-[280px] md:w-[320px] h-[500px] bg-black rounded-3xl overflow-hidden relative shadow-xl snap-center group border border-[#1E2B24]"
    >
      {/* Cinematic Frame Rendering */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={imageUrl}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* High-Contrast Luxury Gradient Gradients overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85 z-10 pointer-events-none" />

      {/* Bottom Text Content & Action Buttons */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-20 text-left space-y-3.5 pointer-events-none">
        {/* Rating Stars */}
        <div className="flex text-[#C9A227]">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#C9A227]" />
          ))}
        </div>

        {/* Client testimonial Quote */}
        <div className="flex items-start space-x-2">
          <Quote className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-1 pointer-events-none" />
          <p className="text-white text-xs font-medium leading-relaxed italic line-clamp-4 shadow-sm font-sans">
            "{reviewText}"
          </p>
        </div>

        {/* City Location Tag */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3.5 mt-2">
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
            {city}, Pakistan
          </span>
          <span className="text-[9.5px] bg-[#C9A227] text-[#0A0D0B] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
            Verified Result
          </span>
        </div>
      </div>

      {/* Top Header Client Header Profiles overlay */}
      <div className="absolute top-0 inset-x-0 p-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2.5 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5">
          <img
            src={avatar}
            alt={name}
            className="w-7 h-7 rounded-full object-cover border border-[#C9A227]/45"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="text-left leading-none">
            <h4 className="text-white text-xs font-bold font-sans tracking-wide">
              {name}
            </h4>
          </div>
        </div>

        {/* Video options (Muted triggers) */}
        <button
          onClick={toggleMute}
          className="p-2 bg-black/45 backdrop-blur-md hover:bg-[#C9A227] hover:text-[#0A0D0B] text-white rounded-full transition-colors z-30 pointer-events-auto border border-white/10"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Center Interactive Action play circles button controls */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <button
          onClick={togglePlay}
          className="w-14 h-14 bg-white/95 hover:bg-white text-[#1F4D3A] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 pointer-events-auto outline-none"
          aria-label={isPlaying ? "Pause Video" : "Play Video"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-[#1F4D3A]" />
          ) : (
            <Play className="w-5 h-5 fill-[#1F4D3A] ml-1" />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default VideoTestimonialCard;
