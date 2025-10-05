import { Calendar, Clock, ShoppingCart, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { format, parseISO } from "date-fns";
import type { Exam } from "@/pages/Index";
import examEnglish from "@/assets/exam-english.jpg";
import examChemistry from "@/assets/exam-chemistry.jpg";
import examMathematics from "@/assets/exam-mathematics.jpg";
import examBiology from "@/assets/exam-biology.jpg";
import examPhysics from "@/assets/exam-physics.jpg";
import examComputer from "@/assets/exam-computer.jpg";

interface ExamCardProps {
  exam: Exam;
  onAddToCart: (exam: Exam) => void;
}

export const ExamCard = ({ exam, onAddToCart }: ExamCardProps) => {
  const categoryColors: Record<string, string> = {
    Languages: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    Sciences: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    Mathematics: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    Humanities: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    Technology: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
    Arts: "bg-pink-500/10 text-pink-700 border-pink-500/20",
    Practical: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  };

  const getExamImage = () => {
    const subject = exam.subject.toLowerCase();
    if (subject.includes("english")) return examEnglish;
    if (subject.includes("chemistry")) return examChemistry;
    if (subject.includes("mathematics") || subject.includes("math")) return examMathematics;
    if (subject.includes("biology")) return examBiology;
    if (subject.includes("physics")) return examPhysics;
    if (subject.includes("computer")) return examComputer;
    if (subject.includes("kiswahili")) return examEnglish;
    return examEnglish; // default fallback
  };

  return (
    <Card className="overflow-hidden hover-lift shadow-card gradient-card border-2">
      <CardHeader className="p-0">
        <div className="h-48 relative overflow-hidden bg-muted">
          <img
            src={getExamImage()}
            alt={exam.subject}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-2">
            {exam.subject}
          </h3>
          {exam.category && (
            <Badge
              variant="outline"
              className={categoryColors[exam.category] || ""}
            >
              {exam.category}
            </Badge>
          )}
        </div>

        <p className="text-sm font-medium text-primary">{exam.paper_code}</p>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {exam.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(parseISO(exam.exam_date), "MMM dd, yyyy")}</span>
            <Badge variant="secondary" className="ml-auto">
              Session {exam.session}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {exam.exam_time} • {exam.duration}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">
              KSh {exam.price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 transition-bounce"
        >
          View Details
        </Button>
        <Button
          onClick={() => onAddToCart(exam)}
          className="flex-1 transition-bounce"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
