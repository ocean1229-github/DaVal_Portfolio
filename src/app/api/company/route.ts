import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCompanyInfo, createCompanyInfo } from '@/lib/notion';

export async function GET() {
    try {
        const companyInfo = await getCompanyInfo();
        return NextResponse.json({ success: true, data: companyInfo });
    } catch (error: any) {
        console.error('Failed to fetch company info:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch company info' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const info = await createCompanyInfo(body);
        return NextResponse.json({ success: true, data: info });
    } catch (error: any) {
        console.error('Failed to create company info:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create company info' },
            { status: 500 }
        );
    }
}
