-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Add admin policies to existing tables
-- Profiles - admins can see all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Budgets - admins can see all budgets
CREATE POLICY "Admins can view all budgets"
ON public.budgets
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all budgets"
ON public.budgets
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all budgets"
ON public.budgets
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Budget items - admins can see all budget items
CREATE POLICY "Admins can view all budget items"
ON public.budget_items
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all budget items"
ON public.budget_items
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all budget items"
ON public.budget_items
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Budget categories - admins can see all budget categories
CREATE POLICY "Admins can view all budget categories"
ON public.budget_categories
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all budget categories"
ON public.budget_categories
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all budget categories"
ON public.budget_categories
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Debts - admins can see all debts
CREATE POLICY "Admins can view all debts"
ON public.debts
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all debts"
ON public.debts
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all debts"
ON public.debts
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Chat conversations - admins can see all conversations
CREATE POLICY "Admins can view all conversations"
ON public.chat_conversations
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all conversations"
ON public.chat_conversations
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all conversations"
ON public.chat_conversations
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Chat messages - admins can see all messages
CREATE POLICY "Admins can view all chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all chat messages"
ON public.chat_messages
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all chat messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (public.is_admin());