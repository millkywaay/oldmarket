import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

export function verifyToken(req: Request): DecodedToken | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as DecodedToken;
    
    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}