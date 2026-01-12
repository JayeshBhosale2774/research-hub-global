-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Authenticated authors can view own payments" ON public.payments;

-- Create a restrictive policy: authors see own, admins/super_admins see all
CREATE POLICY "Authors view own payments admins view all"
ON public.payments
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = author_id
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);