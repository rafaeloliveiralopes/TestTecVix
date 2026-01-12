import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

export interface IPayload {
  idUser: string;
  role: "admin" | "manager" | "member";
}

function getSecret(): jwt.Secret {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(ERROR_MESSAGE.SERVER_ERROR, STATUS_CODE.SERVER_ERROR);
  }
  return secret;
}

export const genToken = (payload: IPayload): string => {
  const secret = getSecret();

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: "HS256",
  });
};

export const verifyToken = (token: string): IPayload => {
  try {
    const secret = getSecret();

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!decoded || typeof decoded === "string") {
      throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
    }

    const { idUser, role } = decoded as Partial<IPayload>;
    if (!idUser || !role) {
      throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
    }

    return { idUser, role };
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
    }
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }
};
