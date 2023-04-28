import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dtos/create-report.dto";
import { AuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { User } from "../users/user.entity";
import { Serialize } from "../interceptors/serialize.interceptor";
import { ReportDto } from "./dtos/report.dto";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() report: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(report, user);
  }
}
