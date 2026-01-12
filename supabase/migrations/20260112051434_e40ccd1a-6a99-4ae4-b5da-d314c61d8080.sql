-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view own profile admins can view all" ON public.profiles;

-- Create a new policy that explicitly requires authentication
CREATE POLICY "Authenticated users can view own profile admins all"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    id = auth.uid() 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);