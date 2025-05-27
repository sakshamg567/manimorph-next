import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { findUserByEmail, createUser } from "./lib/db/dbOps"
import dbConnect from "./lib/db/util"

export const { handlers, auth, signIn, signOut } = NextAuth({
   providers: [Google],
   callbacks: {
      async signIn({user, account, profile}) {
         await dbConnect();

         if(user.email) {
            const existingUser = await findUserByEmail(user.email);

            if(!existingUser) {
               await createUser({
                  email: user.email,
                  name: user.name || undefined,
                  chats: []
               })
            }
            return true;
         }
         return false;
      }
   }
})