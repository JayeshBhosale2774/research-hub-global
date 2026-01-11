-- Drop existing select policy on profiles
DROP POLICY IF EXISTS "Only admins can view profiles" ON public.profiles;

-- Create policy allowing users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

-- Create policy allowing admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));