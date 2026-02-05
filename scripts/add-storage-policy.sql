-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. 모든 사용자가 images 버킷에서 파일을 읽을 수 있도록 허용
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- 2. 모든 사용자가 images 버킷에 파일을 업로드할 수 있도록 허용
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- 3. 모든 사용자가 images 버킷에서 파일을 삭제할 수 있도록 허용
CREATE POLICY "Allow public delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
