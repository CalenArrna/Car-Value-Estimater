import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dtos/create-report.dto";
import { User } from "../users/user.entity";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) {
  }

  create(dto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(dto);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.reportsRepository.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where("make = :make", { make })
      .andWhere("model = :model", { model })
      .andWhere("lng - :lng BETWEEN -5 AND 5", { lng })
      .andWhere("lat - :lat BETWEEN -5 AND 5", { lat })
      .andWhere("year - :year BETWEEN -3 AND 3", { year })
      .andWhere("approved = 1")
      .orderBy("ABS(mileage - :mileage)", "DESC")
      .setParameter("mileage", { mileage })
      .limit(3)
      .getRawOne();
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException(`Can't approve report with id of ${id}`);
    }

    report.approved = approved;
    return this.reportsRepository.save(report);
  }
}
