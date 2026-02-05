import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getPortfolioById, updatePortfolio, deletePortfolio } from '@/lib/notion';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/portfolios/[id]
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const portfolio = await getPortfolioById(id);

        if (!portfolio) {
            return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: portfolio });
    } catch (error: any) {
        console.error('Failed to fetch portfolio:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch portfolio' },
            { status: 500 }
        );
    }
}

// PUT /api/portfolios/[id]
export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();
        const portfolio = await updatePortfolio(id, body);

        return NextResponse.json({ success: true, data: portfolio });
    } catch (error: any) {
        console.error('Failed to update portfolio:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update portfolio' },
            { status: 500 }
        );
    }
}

// DELETE /api/portfolios/[id]
export async function DELETE(req: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        await deletePortfolio(id);

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('Failed to delete portfolio:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete portfolio' },
            { status: 500 }
        );
    }
}
