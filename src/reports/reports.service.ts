import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dtos/create-report.dto";
import { User } from "../users/user.entity";

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) {
  }

  create(dto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(dto);
    report.user = user;
    return this.reportsRepository.save(report);

  }
}
