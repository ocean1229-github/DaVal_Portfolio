import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getPortfolios, createPortfolio } from '@/lib/notion';

// GET /api/portfolios - List all portfolios (Public or Admin)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isPublic = searchParams.get('public') === 'true';

        const portfolios = await getPortfolios(isPublic);

        return NextResponse.json({ success: true, data: portfolios });
    } catch (error: any) {
        console.error('Failed to fetch portfolios:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch portfolios' },
            { status: 500 }
        );
    }
}

// POST /api/portfolios - Create a new portfolio (Admin only)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const portfolio = await createPortfolio(body);

        return NextResponse.json({ success: true, data: portfolio });
    } catch (error: any) {
        console.error('Failed to create portfolio:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create portfolio' },
            { status: 500 }
        );
    }
}
