import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://api-gateway:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
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

    // Proxy vers l'API Gateway
    const response = await fetch(`${API_GATEWAY_URL}/api/messages/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying conversation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
