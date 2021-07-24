import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Company } from 'src/app/models/company/company.model';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { AppStateService } from 'src/app/services/app-state.service';





/*
  TODO:
  - [ ] Should refresh calendar every ~5 minutes
*/



@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleViewComponent implements OnInit {

  company: Company = new Company();
  // employees: Employee[] = [];

  constructor(
    private state: AppStateService,
    private companyService: CompanyService,
  ) {}

  async ngOnInit(): Promise<void>
  {
    this.company = await this.companyService.get(this.state.company_id);
  }

  get working_employees(): Employee[]
  {
    return this.company.employees_working_today;
  }

}
