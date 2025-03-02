import {NextRequest, NextResponse} from 'next/server';
import {api} from "@/lib/utils";

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params1 = await context.params;
  const backendPath = params1.path.join('/');
  const searchParams = req.nextUrl.searchParams;
  const headers = Object.fromEntries(req.headers.entries());
  const backendResponse = await fetch(`${api}/${backendPath}?${searchParams}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Connection': 'close',
    },
  });

  const data = await backendResponse.text();
  return new NextResponse(data, {status: backendResponse.status});
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const searchParams = req.nextUrl.searchParams;
  const {path} = await context.params;
  const backendPath = path.join('/');
  const body = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  const backendResponse = await fetch(`${api}/${backendPath}?${searchParams}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Connection': 'close',
    },
    body,
  });
  const data = await backendResponse.text();
  return new NextResponse(data, {status: backendResponse.status});
}
