-- Create storage policies for papers bucket
-- Allow authenticated users to upload papers to their own folder
CREATE POLICY "Users can upload their own papers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'papers' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to view their own papers
CREATE POLICY "Users can view their own papers"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'papers' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow admins to view all papers
CREATE POLICY "Admins can view all papers"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'papers' AND public.has_role(auth.uid(), 'admin'));