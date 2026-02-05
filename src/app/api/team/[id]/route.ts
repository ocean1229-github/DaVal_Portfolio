import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { updateTeamMember, deleteTeamMember } from '@/lib/notion';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();
        const member = await updateTeamMember(id, body);
        return NextResponse.json({ success: true, data: member });
    } catch (error: any) {
        console.error('Failed to update team member:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update team member' },
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
        await deleteTeamMember(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete team member:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete team member' },
            { status: 500 }
        );
    }
}
