import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { updateCompanyInfo, deleteCompanyInfo } from '@/lib/notion';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();
        const updated = await updateCompanyInfo(id, body);
        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        console.error('Failed to update company info:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update company info' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        await deleteCompanyInfo(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete company info:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete company info' },
            { status: 500 }
        );
    }
}
