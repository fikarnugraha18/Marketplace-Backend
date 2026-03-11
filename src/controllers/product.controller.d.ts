import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
export declare function createProduct(req: AuthRequest, res: Response): Promise<void>;
export declare function getAllProducts(req: Request, res: Response): Promise<void>;
export declare function getProductById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateProduct(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteProduct(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getSellerProducts(req: AuthRequest, res: Response): Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map