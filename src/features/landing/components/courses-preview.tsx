import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { getCategories } from "./api/categories-api";

type Category = {
  id: number;
  name: string;
  image: string | null;
};

export function CoursesPreview() {
  const { t, i18n } = useTranslation("landing");
  const navigate = useNavigate();
  const isAr = i18n.language.startsWith("ar");
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["landing", "categories"],
    queryFn: getCategories,
  });

  const categories: Category[] = data ?? [];
  // Duplicate categories to ensure seamless infinite loop capability
  const duplicatedCategories = [...categories, ...categories];

  // Manual Scroll Handler
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      
      const targetScroll = 
        direction === "left" 
          ? scrollLeft - scrollAmount 
          : scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // Smooth Continuous Auto-Scroll Effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || categories.length === 0) return;

    let animationFrameId: number;
    // Speed factor: pixels per frame (adjust for faster/slower scroll)
    const scrollSpeed = 0.75; 

    const smoothScroll = () => {
      if (!isPaused && container) {
        if (isAr) {
          // In RTL, scrolling goes negative or right-to-left depending on setup, 
          // but native overflow-x usually handles scrollLeft positively from 0 to max.
          // Let's manage standard continuous forward scrolling:
          container.scrollLeft += scrollSpeed;
          // If we pass the halfway mark (the end of the original list), loop back to 0 seamlessly
          if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
          }
        } else {
          container.scrollLeft += scrollSpeed;
          // If we pass the halfway mark, loop back to 0 seamlessly
          if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
          }
        }
      }
      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, categories.length, isAr]);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 via-white to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs sm:text-sm font-semibold mb-4 border border-blue-100/50 shadow-sm"
          >
            {t("courses.badge", { defaultValue: "الدورات المميزة" })}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight"
          >
            اختر المسار الذي يناسبك
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed"
          >
            مجموعة متنوعة من الدورات التدريبية في أحدث المجالات التقنية
          </motion.p>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[4/3] rounded-3xl bg-gray-100 animate-pulse border border-gray-200/60"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-red-50/50 border border-red-100 max-w-md mx-auto text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-gray-900 font-semibold text-lg">فشل في تحميل التصنيفات</p>
            <p className="text-gray-500 text-sm mt-1">يرجى المحاولة مرة أخرى لاحقاً</p>
          </div>
        )}

        {/* Categories Custom Carousel with Smooth Auto-Scroll & Hover Pause */}
        {categories.length > 0 && (
          <div 
            className="relative px-6 sm:px-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            {/* Scroll Buttons */}
            <button
              onClick={() => scroll(isAr ? "right" : "left")}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white transition-all cursor-pointer"
              aria-label="Previous slide"
            >
              {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
              onClick={() => scroll(isAr ? "left" : "right")}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white transition-all cursor-pointer"
              aria-label="Next slide"
            >
              {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              dir={isAr ? "rtl" : "ltr"}
              className="flex gap-6 overflow-x-hidden scroll-smooth snap-x pb-4 pt-2 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {duplicatedCategories.map((category, index) => (
                <div
                  key={`${category.id}-${index}`}
                  className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index % categories.length) * 0.05 }}
                    whileHover={{ y: -6 }}
                    onClick={() => navigate("/courses")}
                    className="cursor-pointer h-full"
                  >
                    <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 h-full group bg-white">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-indigo-500/15 to-purple-500/20 flex items-center justify-center text-5xl font-black text-blue-600">
                            {category.name.charAt(0)}
                          </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent transition-opacity duration-300" />

                        {/* Category Text & Action Hint */}
                        <div className="absolute bottom-5 left-5 right-5 flex flex-col justify-end">
                          <h3 className="text-white text-lg sm:text-xl font-bold line-clamp-2 leading-snug group-hover:text-blue-200 transition-colors">
                            {category.name}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <span>استكشف الدورات</span>
                            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}