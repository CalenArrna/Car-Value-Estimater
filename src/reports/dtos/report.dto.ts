import { Expose, Transform } from "class-transformer";
import { User } from "../../users/user.entity";

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;

  // obj here stands for the original Report Entity, by destructuring TransformFnParams
  @Transform(({obj})=> obj.user.id)
  @Expose()
  userId: number;
}