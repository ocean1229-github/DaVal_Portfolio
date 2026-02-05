import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 이미지 업로드 함수
export async function uploadImage(file: File, bucket: string = 'images'): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (error) {
        console.error('Upload error:', error);
        return null;
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

// 이미지 삭제 함수
export async function deleteImage(url: string, bucket: string = 'images'): Promise<boolean> {
    const fileName = url.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

    if (error) {
        console.error('Delete error:', error);
        return false;
    }

    return true;
}
