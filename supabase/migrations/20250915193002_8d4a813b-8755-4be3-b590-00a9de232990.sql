-- Create tables for collecting anonymous usage data with user consent

-- Tool usage sessions table to track when users use tools
CREATE TABLE public.tool_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NULL, -- NULL for anonymous users
  tool_name text NOT NULL, -- 'debt_calculator', 'budget_planner', 'debt_quiz'
  session_data jsonb NOT NULL, -- Store the actual data entered by users
  consented boolean NOT NULL DEFAULT false, -- User has given consent to store data
  ip_address inet NULL, -- For analytics
  user_agent text NULL, -- For analytics
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tool_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for tool_sessions
CREATE POLICY "Users can view their own sessions"
ON public.tool_sessions
FOR SELECT
USING (
  -- Users can see their own sessions, or if they're admin
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND auth.uid() IS NULL) OR -- Allow anonymous users to see their sessions in same browser session
  is_admin()
);

CREATE POLICY "Users can create sessions"
ON public.tool_sessions
FOR INSERT
WITH CHECK (
  -- Users can create sessions for themselves or anonymous sessions
  (user_id = auth.uid()) OR 
  (user_id IS NULL)
);

CREATE POLICY "Users can update their own sessions"
ON public.tool_sessions
FOR UPDATE
USING (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND auth.uid() IS NULL) OR
  is_admin()
);

CREATE POLICY "Admins can view all sessions"
ON public.tool_sessions
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can delete sessions"
ON public.tool_sessions
FOR DELETE
USING (is_admin());

-- Create trigger for updating timestamps
CREATE TRIGGER update_tool_sessions_updated_at
BEFORE UPDATE ON public.tool_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tool_sessions_user_id ON public.tool_sessions(user_id);
CREATE INDEX idx_tool_sessions_tool_name ON public.tool_sessions(tool_name);
CREATE INDEX idx_tool_sessions_consented ON public.tool_sessions(consented);
CREATE INDEX idx_tool_sessions_created_at ON public.tool_sessions(created_at);