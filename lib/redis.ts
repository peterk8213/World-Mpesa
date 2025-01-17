import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    redisClient = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: 16081,
      },
    });
    // Handle errors
    redisClient.on("error", (err) => console.error("Redis Client Error:", err));

    await redisClient.connect(); // Connect the client
  }

  return redisClient;
};

export default getRedisClient;
