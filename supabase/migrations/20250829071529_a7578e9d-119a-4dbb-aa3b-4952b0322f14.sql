-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_income DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Enable RLS on budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Create budget policies
CREATE POLICY "Users can view their own budgets" 
  ON public.budgets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" 
  ON public.budgets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
  ON public.budgets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
  ON public.budgets FOR DELETE 
  USING (auth.uid() = user_id);

-- Create budget categories table
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name, type)
);

-- Enable RLS on budget categories
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- Create budget categories policies
CREATE POLICY "Users can view their own budget categories" 
  ON public.budget_categories FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budget categories" 
  ON public.budget_categories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget categories" 
  ON public.budget_categories FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget categories" 
  ON public.budget_categories FOR DELETE 
  USING (auth.uid() = user_id);

-- Create budget items table
CREATE TABLE public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.budget_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  planned_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  actual_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on budget items
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;

-- Create budget items policies
CREATE POLICY "Users can view budget items for their budgets" 
  ON public.budget_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.budgets 
      WHERE budgets.id = budget_items.budget_id 
      AND budgets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create budget items for their budgets" 
  ON public.budget_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.budgets 
      WHERE budgets.id = budget_items.budget_id 
      AND budgets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update budget items for their budgets" 
  ON public.budget_items FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.budgets 
      WHERE budgets.id = budget_items.budget_id 
      AND budgets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete budget items for their budgets" 
  ON public.budget_items FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.budgets 
      WHERE budgets.id = budget_items.budget_id 
      AND budgets.user_id = auth.uid()
    )
  );

-- Create debts table
CREATE TABLE public.debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creditor_name TEXT NOT NULL,
  original_amount DECIMAL(10,2) NOT NULL,
  current_balance DECIMAL(10,2) NOT NULL,
  minimum_payment DECIMAL(10,2),
  interest_rate DECIMAL(5,2),
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid_off', 'in_collection')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on debts
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Create debt policies
CREATE POLICY "Users can view their own debts" 
  ON public.debts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debts" 
  ON public.debts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debts" 
  ON public.debts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debts" 
  ON public.debts FOR DELETE 
  USING (auth.uid() = user_id);

-- Create triggers for automatic updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at
  BEFORE UPDATE ON public.budget_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debts_updated_at
  BEFORE UPDATE ON public.debts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default budget categories
INSERT INTO public.budget_categories (user_id, name, type, color) 
SELECT 
  auth.uid(),
  category.name,
  category.type,
  category.color
FROM (
  VALUES 
    ('Løn', 'income', '#10b981'),
    ('Andre indtægter', 'income', '#059669'),
    ('Husleje/bolig', 'expense', '#ef4444'),
    ('Mad og dagligvarer', 'expense', '#f97316'),
    ('Transport', 'expense', '#8b5cf6'),
    ('Forsikringer', 'expense', '#06b6d4'),
    ('Telefon/internet', 'expense', '#84cc16'),
    ('Gæld/afdrag', 'expense', '#dc2626'),
    ('Opsparing', 'expense', '#16a34a'),
    ('Fritid og underholdning', 'expense', '#f59e0b'),
    ('Tøj og personlig pleje', 'expense', '#ec4899'),
    ('Øvrige udgifter', 'expense', '#6b7280')
) AS category(name, type, color)
WHERE auth.uid() IS NOT NULL;