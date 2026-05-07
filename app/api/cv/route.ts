import { NextResponse } from 'next/server';

export async function GET() {
  const url = `${process.env.KV_REST_API_URL}/get/cv_data`;
  const token = process.env.KV_REST_API_READ_ONLY_TOKEN;
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CV data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = `${process.env.KV_REST_API_URL}/set/cv_data`;
  const token = process.env.KV_REST_API_TOKEN;
  
  try {
    const bodyText = await request.text();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain'
      },
      body: bodyText
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving CV data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
