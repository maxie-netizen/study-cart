import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { format, parseISO } from "date-fns";
import type { Exam } from "@/pages/Index";

interface HeroSlideshowProps {
  exams: Exam[];
}

export const HeroSlideshow = ({ exams }: HeroSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (exams.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % exams.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [exams.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + exams.length) % exams.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % exams.length);
  };

  if (exams.length === 0) {
    return (
      <section className="relative h-[500px] gradient-hero flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative z-10 text-center px-4 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            KCSE 2025 Examinations
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            No exams scheduled for today. Check other dates below.
          </p>
        </div>
      </section>
    );
  }

  const currentExam = exams[currentIndex];

  return (
    <section className="relative h-[500px] gradient-hero text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="w-full max-w-4xl mx-auto text-center animate-slide-up">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Today's Examination
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {currentExam.subject}
          </h1>

          <p className="text-lg md:text-xl mb-6 opacity-90">
            {currentExam.paper_code} • Session {currentExam.session}
          </p>

          <div className="flex items-center justify-center gap-6 mb-8 text-sm md:text-base">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar className="w-5 h-5" />
              {format(parseISO(currentExam.exam_date), "EEEE, MMMM do, yyyy")}
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5" />
              {currentExam.exam_time} • {currentExam.duration}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-smooth"
            >
              View Details
            </Button>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-smooth shadow-lg"
            >
              Add to Cart - KSh {currentExam.price.toFixed(2)}
            </Button>
          </div>

          {exams.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {exams.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {exams.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-smooth"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-smooth"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}
    </section>
  );
};
