import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1000 * 60,
  limit: 3,
  handler: (req, res, next) => {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later" });
  },
});
