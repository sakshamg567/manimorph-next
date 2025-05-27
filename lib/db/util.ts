import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
   // eslint-disable-next-line no-var
   var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } | undefined;
}

if(!MONGODB_URI) {
   throw new Error('please define MONGODB_URI in .env file')
}

function getCached() {
   if(!global.mongoose) {
      global.mongoose = {conn: null, promise: null};
   }
   return global.mongoose;
}

async function dbConnect() {
   const cached = getCached();

   if(cached.conn) {
      return cached.conn;
   }

   if(!cached.promise) {
      const opts = {
         bufferCommands: false,
      }

      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
         return mongoose;
      })
   }
   cached.conn = await cached.promise;
   return cached.conn;
}

export default dbConnect;