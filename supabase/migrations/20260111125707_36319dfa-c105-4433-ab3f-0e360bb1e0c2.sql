-- Drop existing SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a single comprehensive SELECT policy that explicitly requires authentication
-- Users can view their own profile OR admins can view all profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    id = auth.uid() 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);