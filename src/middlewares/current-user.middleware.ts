import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users/users.service";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.userService.findOne(parseInt(userId));
      // @ts-ignore
      req.currentUser = user;
    }
    // REMEMBER TO CALL NEXT()! If this is missing, it will be an infinite loop
    next();
  }
}
