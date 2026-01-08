import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken, sanitizeString } from '@/lib/auth';

// GET single ad
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Validate ID is numeric
    const adId = parseInt(id);
    if (isNaN(adId) || adId < 1) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT a.*, u.first_name, u.last_name, u.phone FROM ads a JOIN users u ON a.user_id = u.id WHERE a.id = $1',
      [adId]
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
        // Note: email removed for privacy
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
    const adId = parseInt(id);
    if (isNaN(adId) || adId < 1) {
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

    // Check ownership
    const check = await pool.query('SELECT user_id FROM ads WHERE id = $1', [adId]);
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }
    if (check.rows[0].user_id !== decoded.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { title, description, price, category, location, imageUrl, status } = await request.json();

    // Validate price if provided
    let cleanPrice = undefined;
    if (price !== undefined) {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice < 0 || numPrice > 999999999) {
        return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
      }
      cleanPrice = numPrice;
    }

    // Validate status if provided
    const validStatuses = ['active', 'sold', 'deleted'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    // Sanitize inputs
    const cleanTitle = title ? sanitizeString(title, 200) : undefined;
    const cleanDescription = description !== undefined ? (description ? sanitizeString(description, 5000) : null) : undefined;
    const cleanCategory = category !== undefined ? (category ? sanitizeString(category, 50) : null) : undefined;
    const cleanLocation = location !== undefined ? (location ? sanitizeString(location, 200) : null) : undefined;
    
    let cleanImageUrl = undefined;
    if (imageUrl !== undefined) {
      if (imageUrl) {
        try {
          const url = new URL(imageUrl);
          if (url.protocol === 'https:' || url.protocol === 'http:') {
            cleanImageUrl = imageUrl.slice(0, 500);
          }
        } catch {
          cleanImageUrl = null;
        }
      } else {
        cleanImageUrl = null;
      }
    }

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
      [cleanTitle, cleanDescription, cleanPrice, cleanCategory, cleanLocation, cleanImageUrl, status, adId]
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
    const adId = parseInt(id);
    if (isNaN(adId) || adId < 1) {
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

    // Check ownership
    const check = await pool.query('SELECT user_id FROM ads WHERE id = $1', [adId]);
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }
    if (check.rows[0].user_id !== decoded.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await pool.query('DELETE FROM ads WHERE id = $1', [adId]);
    return NextResponse.json({ message: 'Annonce supprimée' });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
