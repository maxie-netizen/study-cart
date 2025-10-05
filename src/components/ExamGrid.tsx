import { ExamCard } from "./ExamCard";
import { Skeleton } from "./ui/skeleton";
import type { Exam } from "@/pages/Index";

interface ExamGridProps {
  exams: Exam[];
  loading: boolean;
  onAddToCart: (exam: Exam) => void;
}

export const ExamGrid = ({ exams, loading, onAddToCart }: ExamGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="text-center py-16 animate-slide-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          No Exams Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your filters or search query to find examinations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam, index) => (
        <div
          key={exam.id}
          className="animate-slide-up"
          style={{ animationDelay: `${0.1 * (index % 6)}s` }}
        >
          <ExamCard exam={exam} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
};
