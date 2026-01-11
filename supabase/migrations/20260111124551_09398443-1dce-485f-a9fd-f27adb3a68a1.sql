-- Drop existing admin insert policy for audit logs
DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_audit_logs;

-- Create new policy allowing ONLY super_admins to insert audit logs
CREATE POLICY "Super admins can insert audit logs"
ON public.admin_audit_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));