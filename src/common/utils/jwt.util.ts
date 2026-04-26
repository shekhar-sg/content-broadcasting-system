import jwt from "jsonwebtoken";

export namespace JWT {
  export interface Payload {
    userId: string;
    role: string;
    email: string;
  }

  export function sign(payload: Payload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const options: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as NonNullable<jwt.SignOptions["expiresIn"]>,
    };
    return jwt.sign(payload, secret, options);
  }

  export function verify(token: string): Payload {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, secret) as Payload;
  }
}
