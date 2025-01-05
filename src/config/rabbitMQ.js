import amqp from "amqplib";
let channel = null;

import { LOG_QUEUE } from "../constants.js";

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue(LOG_QUEUE);
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ");
  }
};

export { connectRabbitMQ, channel };
