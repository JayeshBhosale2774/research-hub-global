-- Drop existing admin policy for payments
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;

-- Create new policy allowing ONLY super_admins to manage payments
CREATE POLICY "Super admins can manage all payments"
ON public.payments
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));