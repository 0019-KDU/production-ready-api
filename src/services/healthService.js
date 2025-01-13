import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { Redis } from 'ioredis';
import amqp from 'amqplib';

export const checkHealthStatus = async (req, res) => {
  const healthStatus = {
    mongodb: {
      status: 'UNKNOWN',
      latency: null,
      version: null,
      error: null,
    },
    redis: {
      status: 'UNKNOWN',
      latency: null,
      uptime: null,
      error: null,
    },
    rabbitmq: {
      status: 'UNKNOWN',
      latency: null,
      version: null,
      error: null,
    },
  };
  let overallHealthStatus = 200;
  const startTime = Date.now();

  // MongoDB Health Check
  try {
    const mongoStart = Date.now();
    const connection = await mongoose.connect(
      process.env.MONGO_URI.replace('{0}', DB_NAME)
    );
    healthStatus.mongodb.status = 'OK';
    healthStatus.mongodb.latency = Date.now() - mongoStart;
    healthStatus.mongodb.version = connection.version;
  } catch (error) {
    healthStatus.mongodb.status = 'DOWN';
    healthStatus.mongodb.error = error.message;
    overallHealthStatus = 503;
  }

  // Redis Health Check
  try {
    const redisStart = Date.now();
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
    const pingResult = await redisClient.ping();
    const info = await redisClient.info('server');
    if (pingResult === 'PONG') {
      healthStatus.redis.status = 'OK';
    } else {
      throw new Error('Redis ping failed');
    }
    healthStatus.redis.latency = Date.now() - redisStart;
    healthStatus.redis.uptime = info.match(/uptime_in_seconds:(\d+)/)?.[1];
    await redisClient.quit(); // Graceful cleanup
  } catch (error) {
    healthStatus.redis.status = 'DOWN';
    healthStatus.redis.error = error.message;
    overallHealthStatus = 503;
  }

  // RabbitMQ Health Check
  try {
    const rabbitStart = Date.now();
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const serverProperties = connection.serverProperties || {};
    healthStatus.rabbitmq.status = 'OK';
    healthStatus.rabbitmq.latency = Date.now() - rabbitStart;
    healthStatus.rabbitmq.version = serverProperties.version || 'Unknown';
    await connection.close();
  } catch (error) {
    healthStatus.rabbitmq.status = 'DOWN';
    healthStatus.rabbitmq.latency = Date.now() - rabbitStart;
    healthStatus.rabbitmq.error = error.message || 'Unknown error';
    overallHealthStatus = 503;
  }

  // Final Response
  res.status(overallHealthStatus).json({
    timestamp: new Date().toISOString(),
    overallStatus: overallHealthStatus === 200 ? 'Healthy' : 'Unhealthy',
    services: healthStatus,
    responseTime: Date.now() - startTime,
  });
};
