import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://burxbtbaufdleapjjzzo.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cnhidGJhdWZkbGVhcGpqenpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI4MzU3MiwiZXhwIjoyMDg1ODU5NTcyfQ.KFw43p4Iv0xUYECDJYgCjjQphrM9XWHhrhbIEMam5W0';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function testUpload() {
    console.log('테스트 업로드 시도 중...\n');

    // 테스트용 작은 이미지 생성 (1x1 투명 PNG)
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(base64, 'base64');

    const fileName = `test-${Date.now()}.png`;

    const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, buffer, {
            contentType: 'image/png'
        });

    if (error) {
        console.error('업로드 실패:', error.message);
        console.log('\n원인 분석:');
        if (error.message.includes('row-level security')) {
            console.log('- RLS 정책 문제입니다.');
            console.log('- Supabase Dashboard에서 Storage > Policies에서 정책을 추가해야 합니다.');
        } else if (error.message.includes('Bucket not found')) {
            console.log('- 버킷이 존재하지 않습니다.');
        } else {
            console.log('- 기타 오류:', error);
        }
        return false;
    }

    console.log('✓ 테스트 업로드 성공!');
    console.log('파일 경로:', data.path);

    // 업로드 성공하면 Public URL 확인
    const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

    console.log('Public URL:', urlData.publicUrl);

    // 테스트 파일 삭제
    await supabase.storage.from('images').remove([fileName]);
    console.log('✓ 테스트 파일 삭제 완료');

    return true;
}

testUpload();
