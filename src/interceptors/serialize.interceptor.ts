import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Expose, plainToClass } from "class-transformer";
import { UserDto } from "../users/dtos/user.dto";

interface ClassConstructor {
  new (...args: any[]): {}
}
export function Serialize(dto: ClassConstructor){
  return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {
  }
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    //Run something before the request is handled by the controller/request handler

    return next.handle().pipe(
      map((data: any) => {
        //Run something before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        })
      })
    );
  }

}