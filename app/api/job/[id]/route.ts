import { getJobStatus, getJobVideoUrl } from '@/lib/db/dbOps';
import { NextRequest } from 'next/server';

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const { id } = await params;
   console.log(`[SSE] Starting connection for job: ${id}`);

   const encoder = new TextEncoder();
   
   const stream = new ReadableStream({
      start(controller) {
         const sendUpdate = async () => {
            const status = await getJobStatus(id) || 'idle';
            const videoUrl = await getJobVideoUrl(id);
            console.log(`[SSE] Status update for ${id}: ${status}`);
            
            const data = JSON.stringify({ status, videoUrl, id });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            
            return status;
         };

         // Send initial status
         sendUpdate();

         const interval = setInterval(async () => {
            const status = await sendUpdate();
            
            if (status === 'completed' || status === 'failed') {
               console.log(`[SSE] Closing connection for ${id}: ${status}`);
               clearInterval(interval);
               controller.close();
            }
         }, 3000);

         // Cleanup on client disconnect
         request.signal.addEventListener('abort', () => {
            console.log(`[SSE] Client disconnected for ${id}`);
            clearInterval(interval);
            controller.close();
         });
      },
   });

   return new Response(stream, {
      headers: {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive',
         'Access-Control-Allow-Origin': '*',
      },
   });
}