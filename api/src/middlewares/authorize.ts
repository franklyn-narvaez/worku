import { Request, Response, NextFunction } from "express";

export function authorize(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const hasPermission = requiredPermissions.every(p =>
      user.permissions.includes(p)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "No tienes permisos suficientes" });
    }

    next();
  };
}
