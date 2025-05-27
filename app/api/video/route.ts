import { startGeneration } from "@/lib/services/videoService";

export async function POST(req: Request) {
   const {code} = await req.json();
   const jobId = startGeneration(code);
   return new Response(JSON.stringify({jobId}));
}