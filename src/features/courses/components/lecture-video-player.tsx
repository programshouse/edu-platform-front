import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Lock, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { ScreenshotBlocker } from "./screenshot-blocker";

// ─── Mock video URLs (free public domain samples from Google) ───
const MOCK_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
];

type LectureVideoPlayerProps = {
  isFree: boolean;
  lectureTitle: string;
  lectureIndex: number;
};

export function LectureVideoPlayer({
  isFree,
  lectureTitle,
  lectureIndex,
}: LectureVideoPlayerProps) {
  const { t } = useTranslation("courses");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Pick a deterministic mock video based on lecture index
  const videoUrl = MOCK_VIDEOS[lectureIndex % MOCK_VIDEOS.length];

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <ScreenshotBlocker enabled={true}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full rounded-2xl overflow-hidden shadow-xl shadow-blue-100/30"
      >
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative aspect-video bg-gray-950">
          {isFree ? (
            <>
              {/* ─── Actual Video Player (Free Lectures) ─── */}
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                playsInline
                muted={isMuted}
                autoPlay
                loop
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  // Prevent easy video download
                  pointerEvents: "auto",
                }}
              />

              {/* Mute/Unmute floating button */}
              <button
                onClick={toggleMute}
                className="absolute top-4 inset-e-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/70 hover:text-white transition-all cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4.5 h-4.5" />
                ) : (
                  <Volume2 className="w-4.5 h-4.5" />
                )}
              </button>

              {/* Free Preview Badge */}
              <div className="absolute top-4 inset-s-4 z-20">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("details.labels.previewAvailable")}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* ─── Locked Lecture (No Video) ─── */}
              {/* Decorative background */}
              <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900" />

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Animated gradient orbs */}
              <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

              {/* Frosted overlay */}
              <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />

              {/* Lock Icon + Label */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white/60" />
                </div>
                <span className="px-4 py-2 rounded-full bg-red-500/15 backdrop-blur-md border border-red-400/20 text-red-300 text-sm font-medium">
                  🔒 {t("details.labels.contentLocked")}
                </span>
              </motion.div>
            </>
          )}

          {/* Lecture Title Overlay (Bottom) — both free and locked */}
          {!isFree && (
            <div className="absolute bottom-0 inset-x-0 z-20 bg-linear-to-t from-black/60 to-transparent px-6 py-4">
              <p className="text-white/70 text-sm font-medium truncate">
                {lectureTitle}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </ScreenshotBlocker>
  );
}
