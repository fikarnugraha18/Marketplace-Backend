import { Request, Response, NextFunction } from "express";
interface JwtPayload {
    userId: string;
    role: string;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=auth.middleware.d.ts.map