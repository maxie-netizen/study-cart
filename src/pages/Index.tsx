import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { ExamFilters } from "@/components/ExamFilters";
import { ExamGrid } from "@/components/ExamGrid";
import { SearchBar } from "@/components/SearchBar";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { format, isToday, isThisWeek, addWeeks, parseISO } from "date-fns";

export interface Exam {
  id: string;
  subject: string;
  paper_code: string;
  exam_date: string;
  exam_time: string;
  session: number;
  duration: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string | null;
}

const Index = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [filterType, setFilterType] = useState<"today" | "week" | "nextWeek" | "custom">("today");
  const [cartItems, setCartItems] = useState<Exam[]>([]);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    filterExams();
  }, [exams, searchQuery, selectedDate, filterType]);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("exam_date", { ascending: true });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const filterExams = () => {
    let filtered = [...exams];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (exam) =>
          exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.paper_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filters
    const today = new Date();
    if (filterType === "today") {
      filtered = filtered.filter((exam) => isToday(parseISO(exam.exam_date)));
    } else if (filterType === "week") {
      filtered = filtered.filter((exam) => isThisWeek(parseISO(exam.exam_date), { weekStartsOn: 1 }));
    } else if (filterType === "nextWeek") {
      const nextWeekStart = addWeeks(today, 1);
      const nextWeekEnd = addWeeks(today, 2);
      filtered = filtered.filter((exam) => {
        const examDate = parseISO(exam.exam_date);
        return examDate >= nextWeekStart && examDate < nextWeekEnd;
      });
    } else if (filterType === "custom" && selectedDate) {
      filtered = filtered.filter((exam) => {
        const examDate = parseISO(exam.exam_date);
        return format(examDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
      });
    }

    setFilteredExams(filtered);
  };

  const addToCart = (exam: Exam) => {
    if (cartItems.find((item) => item.id === exam.id)) {
      toast.info("Exam already in cart");
      return;
    }
    setCartItems([...cartItems, exam]);
    toast.success("Added to cart");
  };

  const removeFromCart = (examId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== examId));
    toast.success("Removed from cart");
  };

  const todayExams = exams.filter((exam) => isToday(parseISO(exam.exam_date)));

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartItems.length} />
      
      <HeroSlideshow exams={todayExams} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse KCSE 2025 Examinations
          </h2>
          <p className="text-muted-foreground text-lg">
            Select your examination papers and proceed to checkout
          </p>
        </div>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <ExamFilters
          filterType={filterType}
          setFilterType={setFilterType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <ExamGrid
          exams={filteredExams}
          loading={loading}
          onAddToCart={addToCart}
        />
      </main>

      <ShoppingCart
        items={cartItems}
        onRemove={removeFromCart}
        onCheckout={() => toast.success("Checkout feature coming soon!")}
      />
    </div>
  );
};

export default Index;
