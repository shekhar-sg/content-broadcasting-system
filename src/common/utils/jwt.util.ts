import jwt from "jsonwebtoken";
import { Config } from "../../config/config.service";

export namespace JWT {
  export interface Payload {
    userId: string;
    role: string;
    email: string;
  }

  export function sign(payload: Payload): string {
    const secret = Config.Service.jwtSecret;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const options: jwt.SignOptions = {
      expiresIn: Config.Service.jwtExpiry as NonNullable<jwt.SignOptions["expiresIn"]>,
    };
    return jwt.sign(payload, secret, options);
  }

  export function verify(token: string): Payload {
    const secret = Config.Service.jwtSecret;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, secret) as Payload;
  }
}
