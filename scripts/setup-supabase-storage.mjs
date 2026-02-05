import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://burxbtbaufdleapjjzzo.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cnhidGJhdWZkbGVhcGpqenpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI4MzU3MiwiZXhwIjoyMDg1ODU5NTcyfQ.KFw43p4Iv0xUYECDJYgCjjQphrM9XWHhrhbIEMam5W0';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function setupStorage() {
    console.log('Supabase Storage 설정 시작...\n');

    // 1. 기존 버킷 확인
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('버킷 목록 조회 실패:', listError.message);
        return;
    }

    console.log('현재 버킷:', buckets.map(b => b.name).join(', ') || '없음');

    // 2. images 버킷이 있는지 확인
    const imagesBucket = buckets.find(b => b.name === 'images');

    if (imagesBucket) {
        console.log('\n✓ images 버킷이 이미 존재합니다.');

        // Public 여부 확인
        if (imagesBucket.public) {
            console.log('✓ 버킷이 이미 Public입니다.');
        } else {
            console.log('버킷을 Public으로 변경 중...');
            const { error: updateError } = await supabase.storage.updateBucket('images', {
                public: true
            });
            if (updateError) {
                console.error('버킷 업데이트 실패:', updateError.message);
            } else {
                console.log('✓ 버킷을 Public으로 변경했습니다.');
            }
        }
    } else {
        // 3. images 버킷 생성
        console.log('\nimages 버킷 생성 중...');
        const { error: createError } = await supabase.storage.createBucket('images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

        if (createError) {
            console.error('버킷 생성 실패:', createError.message);
            return;
        }
        console.log('✓ images 버킷 생성 완료 (Public)');
    }

    console.log('\n=== 설정 완료 ===');
    console.log('이제 이미지 업로드가 가능합니다!');
}

setupStorage();
