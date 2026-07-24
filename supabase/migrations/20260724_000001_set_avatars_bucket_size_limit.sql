-- Set file size limit for avatars bucket to 1MB (1048576 bytes)
UPDATE storage.buckets
SET file_size_limit = 1048576
WHERE id = 'avatars';
