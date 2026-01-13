-- Drop existing SELECT policy on profiles table
DROP POLICY IF EXISTS "Authenticated users can view own profile admins all" ON public.profiles;

-- Create a new RESTRICTIVE policy that requires authentication
-- Users can only view their own profile, admins can view all
-- Note: AS RESTRICTIVE must come before FOR SELECT
CREATE POLICY "Authenticated users can view own profile admins all" 
ON public.profiles 
AS RESTRICTIVE
FOR SELECT 
TO authenticated
USING (
  (id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure RLS is enabled and forced (blocks unauthenticated access)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;