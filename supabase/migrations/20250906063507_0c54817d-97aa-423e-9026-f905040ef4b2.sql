-- Fix security issue: Update function to set search_path for security
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- For company users, require company_name and cvr_number
  IF NEW.user_type = 'company' THEN
    IF NEW.company_name IS NULL OR trim(NEW.company_name) = '' THEN
      RAISE EXCEPTION 'Company name is required for company users';
    END IF;
    IF NEW.cvr_number IS NULL OR trim(NEW.cvr_number) = '' THEN
      RAISE EXCEPTION 'CVR number is required for company users';
    END IF;
  END IF;
  
  -- For individual users, require first_name and last_name
  IF NEW.user_type = 'individual' THEN
    IF NEW.first_name IS NULL OR trim(NEW.first_name) = '' THEN
      RAISE EXCEPTION 'First name is required for individual users';
    END IF;
    IF NEW.last_name IS NULL OR trim(NEW.last_name) = '' THEN
      RAISE EXCEPTION 'Last name is required for individual users';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;