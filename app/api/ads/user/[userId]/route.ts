import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    
    // Validate userId is numeric
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum) || userIdNum < 1) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Only allow users to see their own ads
    if (userIdNum !== decoded.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const result = await pool.query(
      'SELECT * FROM ads WHERE user_id = $1 ORDER BY created_at DESC',
      [userIdNum]
    );

    return NextResponse.json({
      ads: result.rows.map(ad => ({
        id: ad.id,
        userId: ad.user_id,
        title: ad.title,
        description: ad.description,
        price: parseFloat(ad.price),
        category: ad.category,
        location: ad.location,
        imageUrl: ad.image_url,
        status: ad.status,
        createdAt: ad.created_at,
        updatedAt: ad.updated_at,
      })),
    });
  } catch (error) {
    console.error('Get user ads error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
