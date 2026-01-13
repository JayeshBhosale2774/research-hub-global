-- Create a function to extract only author names from the JSONB authors field
-- This sanitizes the data by removing email and institution from public view
CREATE OR REPLACE FUNCTION public.get_sanitized_author_names(authors_json JSONB)
RETURNS TEXT[]
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result TEXT[] := '{}';
  author_record JSONB;
BEGIN
  -- Handle case where authors_json is an array of objects with 'name' field
  IF jsonb_typeof(authors_json) = 'array' THEN
    FOR author_record IN SELECT * FROM jsonb_array_elements(authors_json)
    LOOP
      -- Extract only the name field, ignore email and institution
      IF author_record ? 'name' THEN
        result := array_append(result, author_record->>'name');
      ELSIF jsonb_typeof(author_record) = 'string' THEN
        -- Handle case where it's just a string (legacy data)
        result := array_append(result, author_record#>>'{}');
      END IF;
    END LOOP;
  END IF;
  RETURN result;
END;
$$;

-- Create a secure view for publicly visible papers that only shows sanitized author names
CREATE OR REPLACE VIEW public.published_papers_public AS
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