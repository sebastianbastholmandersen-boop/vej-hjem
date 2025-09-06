-- Create user type enum
CREATE TYPE public.user_type AS ENUM ('individual', 'company');

-- Update profiles table to support both individuals and companies
ALTER TABLE public.profiles 
ADD COLUMN user_type public.user_type DEFAULT 'individual' NOT NULL,
ADD COLUMN company_name TEXT,
ADD COLUMN cvr_number TEXT,
ADD COLUMN company_address TEXT,
ADD COLUMN contact_person TEXT;

-- Create index for CVR numbers (unique for companies)
CREATE UNIQUE INDEX idx_profiles_cvr_number ON public.profiles(cvr_number) WHERE cvr_number IS NOT NULL;

-- Add check constraint to ensure company data is provided for company users
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for profile validation
CREATE TRIGGER validate_profile_data_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_data();

-- Update the trigger function to handle user type in profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    user_type,
    first_name, 
    last_name,
    company_name,
    cvr_number
  )
  VALUES (
    NEW.id, 
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'individual'),
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.raw_user_meta_data ->> 'cvr_number'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;