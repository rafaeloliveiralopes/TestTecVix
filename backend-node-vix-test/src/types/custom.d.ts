import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface CustomRequest<
  TUser = unknown,
  TParams = ParamsDictionary,
  TResBody = unknown,
  TReqBody = unknown,
  TReqQuery = ParsedQs,
> extends Request<TParams, TResBody, TReqBody, TReqQuery> {
  user?: TUser;
}
