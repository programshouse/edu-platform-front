import { useEffect, useCallback, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";

type ScreenshotBlockerProps = {
  children: ReactNode;
  enabled?: boolean;
};

/**
 * Wraps video content with multiple layers of screenshot / screen-recording
 * protection.  Works best as a deterrent — no client-side approach can be 100 %
 * bullet-proof, but the combination below stops the vast majority of casual
 * capture attempts.
 *
 * Protections:
 *  1. Right-click / context-menu disabled on the wrapper
 *  2. PrintScreen & common screenshot shortcuts intercepted
 *  3. Page Visibility API – blurs the video when tab loses focus
 *  4. Transparent watermark overlay (pointer-events: none)
 *  5. CSS user-select: none + drag prevention
 */
export function ScreenshotBlocker({
  children,
  enabled = true,
}: ScreenshotBlockerProps) {
  const { t } = useTranslation("courses");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // ─── Flash warning banner ───
  const flashWarning = useCallback(() => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 2500);
  }, []);

  // ─── 1. Block right-click ───
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      e.preventDefault();
      flashWarning();
    },
    [enabled, flashWarning],
  );

  // ─── 2. Block screenshot shortcuts ───
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // PrintScreen
      if (key === "PrintScreen") {
        e.preventDefault();
        flashWarning();
        // Overwrite clipboard with empty
        navigator.clipboard?.writeText?.("").catch(() => {});
        return;
      }

      // Ctrl/Cmd + Shift + S  (browser screenshot tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && key.toLowerCase() === "s") {
        e.preventDefault();
        flashWarning();
        return;
      }

      // Cmd + Shift + 3/4/5 (macOS screenshots)
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(key)) {
        e.preventDefault();
        flashWarning();
        return;
      }

      // Windows Snipping Tool  (Win + Shift + S)
      if (e.metaKey && e.shiftKey && key.toLowerCase() === "s") {
        e.preventDefault();
        flashWarning();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [enabled, flashWarning]);

  // ─── 3. Blur on tab / window switch ───
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      setIsBlurred(document.hidden);
    };

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [enabled]);

  // ─── 5. Prevent drag ───
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (enabled) e.preventDefault();
    },
    [enabled],
  );

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      className="relative select-none"
      style={{ WebkitUserSelect: "none" }}
    >
      {/* ─── Warning Banner ─── */}
      {showWarning && (
        <div className="absolute top-4 inset-x-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/95 backdrop-blur-md text-white text-sm font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          {t("details.labels.screenshotBlocked", "Screenshots are not allowed for this content")}
        </div>
      )}

      {/* ─── Blur overlay when inactive ─── */}
      {isBlurred && (
        <div className="absolute inset-0 z-40 bg-gray-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white/80">
            <ShieldAlert className="w-10 h-10" />
            <p className="text-sm font-semibold">
              {t("details.labels.contentProtected", "Content is protected")}
            </p>
          </div>
        </div>
      )}

      {/* ─── 4. Watermark overlay ─── */}
      <div
        className="absolute inset-0 z-30 pointer-events-none select-none overflow-hidden rounded-2xl"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 80px, currentColor 80px, currentColor 81px)",
            color: "white",
          }}
        />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
