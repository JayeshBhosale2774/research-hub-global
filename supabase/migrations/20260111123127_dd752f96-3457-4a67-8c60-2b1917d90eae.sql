-- Drop existing audit log policies
DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;

-- Create policy allowing all admins to INSERT audit logs (needed for logging actions)
CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create policy allowing ONLY super_admins to VIEW audit logs (restricted access)
CREATE POLICY "Super admins can view audit logs"
ON public.admin_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));