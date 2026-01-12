-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "author_can_view_own_payments" ON public.payments;

-- Create a new policy that explicitly requires authentication
CREATE POLICY "Authenticated authors can view own payments"
ON public.payments
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = author_id
);