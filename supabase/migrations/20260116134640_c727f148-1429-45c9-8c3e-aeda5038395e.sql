-- Create a policy to allow anyone to download papers that are published
-- We need to check if the paper associated with the file is published

CREATE POLICY "Anyone can view published papers files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'papers' 
  AND EXISTS (
    SELECT 1 FROM public.papers p
    WHERE p.status = 'published'
    AND p.file_path = name
  )
);