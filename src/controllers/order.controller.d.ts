import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
export declare function checkout(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMyOrders(req: AuthRequest, res: Response): Promise<void>;
export declare function getSellerOrders(req: AuthRequest, res: Response): Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map