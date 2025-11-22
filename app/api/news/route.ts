// app/api/news/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. クライアントから送られてきたURLのパラメータ（日付）を取得
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not found' }, { status: 500 });
  }
  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=apple&from=${date}&to=${date}&sortBy=popularity&apiKey=${apiKey}`
    );    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}