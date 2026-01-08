import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lemauvaisCoin-super-secret-jwt-key-2026';

// GET all ads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    let query = 'SELECT a.*, u.first_name, u.last_name, u.phone FROM ads a JOIN users u ON a.user_id = u.id WHERE a.status = $1';
    const params: any[] = ['active'];
    let paramIndex = 2;

    if (category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Count total
    let countQuery = 'SELECT COUNT(*) FROM ads WHERE status = $1';
    const countParams: any[] = ['active'];
    if (category) {
      countQuery += ' AND category = $2';
      countParams.push(category);
    }
    if (search) {
      countQuery += ` AND (title ILIKE $${countParams.length + 1} OR description ILIKE $${countParams.length + 1})`;
      countParams.push(`%${search}%`);
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
          phone: ad.phone,
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

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const { title, description, price, category, location, imageUrl } = await request.json();

    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Titre et prix requis' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO ads (user_id, title, description, price, category, location, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [decoded.userId, title, description || null, price, category || null, location || null, imageUrl || null]
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
