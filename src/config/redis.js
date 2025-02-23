import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err?.message);
});

export default redisClient;
