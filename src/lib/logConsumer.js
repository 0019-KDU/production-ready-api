import { channel, connectRabbitMQ } from "../config/rabbitMQ.js";
import { LOG_QUEUE } from "../constants.js";

export const startLogConsumer = async () => {
  await connectRabbitMQ();
  channel.consume(LOG_QUEUE, async (msg) => {
    if (msg !== null) {
      const log = JSON.parse(msg.content.toString());
      console.log(log);
      channel.ack(msg);
    }
  });
};

startLogConsumer().catch((error) => console.error("faild to consume queue"));
