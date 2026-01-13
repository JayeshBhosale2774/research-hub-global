-- Drop the existing SELECT policy on payments table
DROP POLICY IF EXISTS "Authors view own payments admins view all" ON public.payments;

-- Create a new RESTRICTIVE policy that requires authentication
-- Authors can only view their own payments, admins/super_admins can view all
CREATE POLICY "Authors view own payments admins view all" 
ON public.payments 
AS RESTRICTIVE
FOR SELECT 
TO authenticated
USING (
  (auth.uid() = author_id) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Ensure RLS is enabled and forced (blocks unauthenticated access)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;