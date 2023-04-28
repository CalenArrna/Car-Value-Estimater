import { Injectable, NotFoundException } from "@nestjs/common";
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

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne({ where: { id: parseInt(id) } });
    if(!report) {
      throw new NotFoundException(`Can't approve report with id of ${id}`)
    }

    report.approved=approved;
    return this.reportsRepository.save(report);
  }
}
