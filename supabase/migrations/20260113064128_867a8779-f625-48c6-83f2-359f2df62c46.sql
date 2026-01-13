-- Drop and recreate the view with SECURITY INVOKER (uses caller's permissions)
DROP VIEW IF EXISTS public.published_papers_public;

CREATE VIEW public.published_papers_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  title,
  abstract,
  domain,
  publication_type,
  keywords,
  public.get_sanitized_author_names(authors) AS author_names,
  status,
  published_at,
  created_at
FROM public.papers
WHERE status = 'published'::paper_status;

-- Grant SELECT on the view to authenticated and anonymous users
GRANT SELECT ON public.published_papers_public TO authenticated;
GRANT SELECT ON public.published_papers_public TO anon;