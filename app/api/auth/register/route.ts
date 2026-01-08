import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, isValidEmail, isValidPassword, sanitizeString } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Format d\'email invalide' }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanFirstName = firstName ? sanitizeString(firstName, 50) : null;
    const cleanLastName = lastName ? sanitizeString(lastName, 50) : null;
    const cleanPhone = phone ? sanitizeString(phone, 20) : null;

    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Hash password with higher cost factor
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, phone, created_at',
      [cleanEmail, passwordHash, cleanFirstName, cleanLastName, cleanPhone]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = signToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      message: 'Utilisateur créé',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
