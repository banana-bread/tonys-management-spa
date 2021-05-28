import { Component, OnInit } from '@angular/core';
import { CompanyService } from './models/company/company.service';
import { EmployeeService } from './models/employee/employee.service';
import { AppStateService } from './services/app-state.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'management-spa'

  constructor(
    private auth: AuthService,
    private state: AppStateService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
  ) {}

  ngOnInit(): void 
  {
    console.log('HERE')
    this.onAddState();
  }

  // TODO: should probably refine this to get company and employee in one shot
  //       Will do, first need to figure out model relations
  private async onAddState()
  {
    if (! this.auth.isLoggedIn()) return;

    const employee = await this.employeeService.getAuthed();
    const company = await this.companyService.get(employee.company_id);

    this.state.setEmployee(employee);
    this.state.setCompany(company);
  }
  

}
