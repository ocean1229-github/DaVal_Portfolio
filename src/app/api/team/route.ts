import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getTeamMembers, createTeamMember } from '@/lib/notion';

export async function GET() {
    try {
        const members = await getTeamMembers();
        return NextResponse.json({ success: true, data: members });
    } catch (error: any) {
        console.error('Failed to fetch team members:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch team members' },
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
        const member = await createTeamMember(body);
        return NextResponse.json({ success: true, data: member });
    } catch (error: any) {
        console.error('Failed to create team member:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create team member' },
            { status: 500 }
        );
    }
}
