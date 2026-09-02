import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: Cache;
};

const cache: Cache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

export function hasMongoUri() {
  return Boolean(MONGODB_URI);
}

export async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
