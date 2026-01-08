import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken, sanitizeString } from '@/lib/auth';

// GET all ads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    let query = 'SELECT a.*, u.first_name, u.last_name FROM ads a JOIN users u ON a.user_id = u.id WHERE a.status = $1';
    const params: (string | number)[] = ['active'];
    let paramIndex = 2;

    if (category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(sanitizeString(category, 50));
      paramIndex++;
    }

    if (search) {
      const cleanSearch = sanitizeString(search, 100);
      query += ` AND (a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`;
      params.push(`%${cleanSearch}%`);
      paramIndex++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Count total
    let countQuery = 'SELECT COUNT(*) FROM ads WHERE status = $1';
    const countParams: (string | number)[] = ['active'];
    if (category) {
      countQuery += ' AND category = $2';
      countParams.push(sanitizeString(category, 50));
    }
    if (search) {
      countQuery += ` AND (title ILIKE $${countParams.length + 1} OR description ILIKE $${countParams.length + 1})`;
      countParams.push(`%${sanitizeString(search, 100)}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

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
        user: {
          firstName: ad.first_name,
          lastName: ad.last_name,
          // Note: phone removed for privacy - only shown in ad detail
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get ads error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST create ad
export async function POST(request: NextRequest) {
  try {
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

    const { title, description, price, category, location, imageUrl } = await request.json();

    // Validation
    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Titre et prix requis' }, { status: 400 });
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0 || numPrice > 999999999) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
    }

    // Sanitize inputs
    const cleanTitle = sanitizeString(title, 200);
    const cleanDescription = description ? sanitizeString(description, 5000) : null;
    const cleanCategory = category ? sanitizeString(category, 50) : null;
    const cleanLocation = location ? sanitizeString(location, 200) : null;
    
    // Validate imageUrl if provided (must be a valid URL)
    let cleanImageUrl = null;
    if (imageUrl) {
      try {
        const url = new URL(imageUrl);
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          cleanImageUrl = imageUrl.slice(0, 500);
        }
      } catch {
        // Invalid URL, ignore
      }
    }

    const result = await pool.query(
      'INSERT INTO ads (user_id, title, description, price, category, location, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [decoded.userId, cleanTitle, cleanDescription, numPrice, cleanCategory, cleanLocation, cleanImageUrl]
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
    }, { status: 201 });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
