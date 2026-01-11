-- Drop existing public SELECT policy
DROP POLICY IF EXISTS "Public can view valid certificates" ON public.certificates;

-- Create policy allowing only certificate owners to view their certificates
CREATE POLICY "Authors can view their own certificates"
ON public.certificates
FOR SELECT
USING (paper_id IN (SELECT id FROM public.papers WHERE author_id = auth.uid()));