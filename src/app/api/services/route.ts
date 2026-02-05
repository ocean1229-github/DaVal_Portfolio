import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getServices, createService } from '@/lib/notion';

export async function GET() {
    try {
        const services = await getServices();
        return NextResponse.json({ success: true, data: services });
    } catch (error: any) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch services' },
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
        const service = await createService(body);
        return NextResponse.json({ success: true, data: service });
    } catch (error: any) {
        console.error('Failed to create service:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create service' },
            { status: 500 }
        );
    }
}
