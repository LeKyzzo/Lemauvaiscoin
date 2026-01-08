import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lemauvaisCoin-super-secret-jwt-key-2026';

// GET single ad
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await pool.query(
      'SELECT a.*, u.first_name, u.last_name, u.phone, u.email FROM ads a JOIN users u ON a.user_id = u.id WHERE a.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }

    const ad = result.rows[0];
    return NextResponse.json({
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
      user: {
        firstName: ad.first_name,
        lastName: ad.last_name,
        phone: ad.phone,
        email: ad.email,
      },
    });
  } catch (error) {
    console.error('Get ad error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT update ad
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // Check ownership
    const check = await pool.query('SELECT user_id FROM ads WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }
    if (check.rows[0].user_id !== decoded.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { title, description, price, category, location, imageUrl, status } = await request.json();

    const result = await pool.query(
      `UPDATE ads SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        category = COALESCE($4, category),
        location = COALESCE($5, location),
        image_url = COALESCE($6, image_url),
        status = COALESCE($7, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *`,
      [title, description, price, category, location, imageUrl, status, id]
    );

    const ad = result.rows[0];
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Update ad error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE ad
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // Check ownership
    const check = await pool.query('SELECT user_id FROM ads WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }
    if (check.rows[0].user_id !== decoded.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await pool.query('DELETE FROM ads WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Annonce supprimée' });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
