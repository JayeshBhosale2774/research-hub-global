-- Drop existing author SELECT policy and recreate with strict filtering
DROP POLICY IF EXISTS "Authors can view their own payments" ON public.payments;

-- Create stricter policy that ensures authors can only view their own payments
CREATE POLICY "author_can_view_own_payments"
ON public.payments
FOR SELECT
USING (auth.uid() = author_id);