import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dtos/create-report.dto";
import { AuthGuard } from "../guards/auth.guard";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() report: CreateReportDto) {
    return this.reportsService.create(report);
  }
}
