import amqp from "amqplib";
let channel = null;

import { LOG_QUEUE } from "../constants.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRY_COUNT = 5;
let currentCount = 0;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue(LOG_QUEUE);
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ");
    currentCount++;
    if (currentCount < MAX_RETRY_COUNT) {
      await sleep(5000); // wait for 5 seconds before retrying
      console.log("Maximum retry count exceeded");
      await connectRabbitMQ();
    }
  }
};

export { connectRabbitMQ, channel };
