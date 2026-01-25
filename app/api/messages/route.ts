import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// API Gateway URL - routes API Next.js run server-side only
// In Docker: use service name 'api-gateway'
// Local dev: use localhost
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://api-gateway:3001';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // Vérifier le token
    try {
      verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const body = await request.json();

    // Proxy vers l'API Gateway
    const response = await fetch(`${API_GATEWAY_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error proxying message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
