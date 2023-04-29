import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";

declare global{
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      req.currentUser = await this.userService.findOne(parseInt(userId));
    }
    // REMEMBER TO CALL NEXT()! If this is missing, it will be an infinite loop
    next();
  }
}
