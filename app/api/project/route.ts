import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;
    const lastMessage = Array.isArray(messages) ? messages[messages.length - 1] : null;

    let prompt = 'Modern Website';
    if (lastMessage?.parts && Array.isArray(lastMessage.parts)) {
      const textPart = lastMessage.parts.find((p: { type: string; text?: string }) => p.type === 'text');
      if (textPart?.text) {
        prompt = textPart.text;
      }
    } else if (typeof lastMessage?.content === 'string') {
      prompt = lastMessage.content;
    }

    const title = prompt.length > 35 ? `${prompt.slice(0, 35)}...` : prompt;

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // 1. Emit project title
        writer.write({
          type: 'data-project-title',
          data: { title },
        } as unknown as Parameters<typeof writer.write>[0]);

        // 2. Emit pages skeleton
        writer.write({
          type: 'data-pages-skeleton',
          data: {
            pages: [{ id: 'home', name: 'Home', rootStyles: '' }],
          },
        } as unknown as Parameters<typeof writer.write>[0]);

        // 3. Emit message text response
        writer.write({
          type: 'text-delta',
          textDelta: `Designing website layout for: "${prompt}". Created the initial responsive layout.`,
        } as unknown as Parameters<typeof writer.write>[0]);

        // 4. Emit created page
        writer.write({
          type: 'data-page-created',
          data: {
            tempId: 'home',
            page: {
              id: 'home',
              name: 'Home',
              rootStyles: '',
              htmlContent: `<section class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8"><div class="max-w-3xl text-center space-y-6"><span class="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">AI Generated Design</span><h1 class="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">${title}</h1><p class="text-slate-400 text-lg leading-relaxed">${prompt}</p><div class="flex items-center justify-center gap-4 pt-4"><button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">Get Started</button><button class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-all">Learn More</button></div></div></section>`,
              isLoading: false,
            },
          },
        } as unknown as Parameters<typeof writer.write>[0]);
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error('Error in /api/project:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
