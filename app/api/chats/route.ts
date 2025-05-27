import { getUserChats } from '@/lib/db/dbOps';
import { auth } from '@/auth';

export async function GET() {
   try {
      const session = await auth();
      if (!session || !session.user) {
         return new Response(JSON.stringify([]), { status: 401 });
      }

      const userId = session.user.email;
      const chats = await getUserChats(userId as string);

      return Response.json(chats);
   } catch (error) {
      console.error('Error fetching chats:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch chats' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' }
      });
   }
}