import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { updateService, deleteService } from '@/lib/notion';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();
        const service = await updateService(id, body);
        return NextResponse.json({ success: true, data: service });
    } catch (error: any) {
        console.error('Failed to update service:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update service' },
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
        await deleteService(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete service:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete service' },
            { status: 500 }
        );
    }
}
