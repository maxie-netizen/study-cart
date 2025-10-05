-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  paper_code TEXT NOT NULL,
  exam_date DATE NOT NULL,
  exam_time TIME NOT NULL,
  session INTEGER NOT NULL CHECK (session IN (1, 2)),
  duration TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exam_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for exams (public read)
CREATE POLICY "Exams are viewable by everyone" 
ON public.exams 
FOR SELECT 
USING (true);

-- Create policies for cart_items (user-specific)
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for orders (user-specific)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for order_items (user-specific through orders)
CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_exams_updated_at
BEFORE UPDATE ON public.exams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample exam data based on the timetable
INSERT INTO public.exams (subject, paper_code, exam_date, exam_time, session, duration, description, price, category) VALUES
('English (Functional Skills)', '101/1', '2025-11-03', '08:00:00', 1, '2 hours', 'English Paper 1 - Functional Writing Skills including essays, letters, and reports', 500.00, 'Languages'),
('Chemistry', '233/1', '2025-11-04', '08:00:00', 1, '2 hours', 'Chemistry Paper 1 - Theory covering organic, inorganic, and physical chemistry', 600.00, 'Sciences'),
('Mathematics Alt. A', '121/1', '2025-11-04', '08:00:00', 1, '2 hours 30 minutes', 'Mathematics Alternative A Paper 1 - Pure mathematics and algebra', 650.00, 'Mathematics'),
('English (Comprehension)', '101/2', '2025-11-04', '14:00:00', 2, '2 hours 30 minutes', 'English Paper 2 - Reading comprehension, literary appreciation, and grammar', 500.00, 'Languages'),
('Chemistry', '233/2', '2025-11-05', '08:00:00', 1, '2 hours', 'Chemistry Paper 2 - Practical applications and problem-solving', 600.00, 'Sciences'),
('General Science', '237/1', '2025-11-05', '08:00:00', 1, '2 hours 30 minutes', 'General Science Paper 1 - Integrated science concepts', 550.00, 'Sciences'),
('English (Creative Composition)', '101/3', '2025-11-05', '14:00:00', 2, '2 hours 30 minutes', 'English Paper 3 - Creative writing and essay composition based on set texts', 500.00, 'Languages'),
('Kiswahili (Lugha)', '102/2', '2025-11-06', '08:00:00', 1, '2 hours 30 minutes', 'Kiswahili Paper 2 - Language structure and grammar', 500.00, 'Languages'),
('Kiswahili (Insha)', '102/1', '2025-11-07', '14:00:00', 2, '1 hour 45 minutes', 'Kiswahili Paper 1 - Creative essay writing', 500.00, 'Languages'),
('Mathematics Alt. A', '121/2', '2025-11-10', '08:00:00', 1, '2 hours 30 minutes', 'Mathematics Alternative A Paper 2 - Applied mathematics and problem-solving', 650.00, 'Mathematics'),
('Kiswahili (Fasihi)', '102/3', '2025-11-10', '14:00:00', 2, '2 hours 30 minutes', 'Kiswahili Paper 3 - Literature and set texts analysis', 500.00, 'Languages'),
('Biology', '231/1', '2025-11-11', '08:00:00', 1, '2 hours', 'Biology Paper 1 - Theory covering cell biology, genetics, and ecology', 600.00, 'Sciences'),
('Physics', '232/1', '2025-11-11', '14:00:00', 2, '2 hours', 'Physics Paper 1 - Mechanics, electricity, and modern physics', 600.00, 'Sciences'),
('Biology', '231/2', '2025-11-12', '08:00:00', 1, '2 hours', 'Biology Paper 2 - Applied biology and practical concepts', 600.00, 'Sciences'),
('History', '311/1', '2025-11-12', '14:00:00', 2, '2 hours 30 minutes', 'History Paper 1 - African and world history', 550.00, 'Humanities'),
('Physics', '232/2', '2025-11-13', '08:00:00', 1, '2 hours', 'Physics Paper 2 - Applied physics and problem-solving', 600.00, 'Sciences'),
('Geography', '312/1', '2025-11-13', '14:00:00', 2, '2 hours 30 minutes', 'Geography Paper 1 - Physical and human geography', 550.00, 'Humanities'),
('Computer Studies', '451/1', '2025-10-31', '14:00:00', 2, '2 hours', 'Computer Studies Paper 1 - Theory covering programming and systems', 700.00, 'Technology'),
('Art and Design', '442/2', '2025-10-31', '08:00:00', 1, '4 hours', 'Art and Design Paper 2 - Practical drawing and design work', 800.00, 'Arts'),
('Home Science', '441/3', '2025-10-29', '08:00:00', 1, '1 hour', 'Home Science Paper 3 - Foods and nutrition practical exam', 650.00, 'Practical');