import jwt from "jsonwebtoken";
import { iJwtService } from "../../entities/Iservice/Ijwtservice";

class JwtToken implements iJwtService {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtRefreshTokenSecret: string
  ) {}

  generateToken(id: string): string {
    const token = jwt.sign({ id }, this.jwtSecret, {
      expiresIn: "1h",
    });
    return token;
  }

  verifyToken(token: string): { id: string } | null {
    try {
      console.log(token, "is the token in the fn");
      console.log(this.jwtSecret, "is the jwt secret");

      const decodedToken = jwt.verify(token, this.jwtSecret) as {
        id: string;
      };
      console.log(decodedToken, "in the function decoded");
      return decodedToken;
    } catch (error) {
      console.error("Invalid or expired token", error);
      return null;
    }
  }
  VerifyTokenRefresh(token: string): { id: string } | null {
    try {
      const decodedToken = jwt.verify(token, this.jwtRefreshTokenSecret) as {
        id: string;
      };
      return decodedToken;
    } catch (error) {
      console.error("Invalid or expired token", error);
      return null;
    }
  }

  generateRefreshToken(id: string): string {
    const refreshToken = jwt.sign({ id }, this.jwtRefreshTokenSecret, {
      expiresIn: "7d",
    });
    return refreshToken;
  }
}

export default JwtToken;
