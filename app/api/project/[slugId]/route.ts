import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slugId: string }> }
) {
  const { slugId } = await params;

  return NextResponse.json({
    title: 'New Web Project',
    slugId,
    messages: [],
    pages: [
      {
        id: 'home',
        name: 'Home',
        rootStyles: '',
        htmlContent: '<div class="min-h-screen flex items-center justify-center p-8"><h1 class="text-3xl font-bold">Welcome to your new website</h1></div>',
        isLoading: false,
      },
    ],
  });
}
