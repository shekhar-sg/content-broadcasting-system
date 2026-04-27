import rateLimit from "express-rate-limit";

export namespace RateLimiter {
  export const auth = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many auth requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  export const api = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  export const broadcast = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: { success: false, message: "Too many broadcast requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
