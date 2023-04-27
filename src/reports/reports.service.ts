import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dtos/create-report.dto";

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) {
  }
  create(dto: CreateReportDto) {
    const report = this.reportsRepository.create(dto);

    return this.reportsRepository.save(report);

  }
}
