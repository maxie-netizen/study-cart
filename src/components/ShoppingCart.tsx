import { ShoppingCart as CartIcon, X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import type { Exam } from "@/pages/Index";

interface ShoppingCartProps {
  items: Exam[];
  onRemove: (examId: string) => void;
  onCheckout: () => void;
}

export const ShoppingCart = ({ items, onRemove, onCheckout }: ShoppingCartProps) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-8 right-8 shadow-glow transition-bounce z-40 px-6"
        >
          <CartIcon className="w-5 h-5 mr-2" />
          Cart ({items.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <CartIcon className="w-6 h-6" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-4">
              <CartIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Add some exams to get started!
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-250px)] pr-4 mt-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-card transition-smooth"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground line-clamp-1">
                        {item.subject}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.paper_code}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        KSh {item.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(item.id)}
                      className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-smooth"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    KSh {total.toFixed(2)}
                  </span>
                </div>
                <Button
                  size="lg"
                  onClick={onCheckout}
                  className="w-full transition-bounce"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
