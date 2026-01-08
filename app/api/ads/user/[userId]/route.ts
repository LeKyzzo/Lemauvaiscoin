import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lemauvaisCoin-super-secret-jwt-key-2026';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    if (parseInt(userId) !== decoded.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const result = await pool.query(
      'SELECT * FROM ads WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
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
