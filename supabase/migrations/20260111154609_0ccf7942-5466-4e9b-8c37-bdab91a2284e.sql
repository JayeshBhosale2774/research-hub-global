-- Drop the current SELECT policy that's too permissive
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a restrictive policy: users can ONLY view their own profile
-- Admins can view all profiles for administrative purposes
CREATE POLICY "Users can view own profile admins can view all"
ON public.profiles
FOR SELECT
USING (
  id = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);