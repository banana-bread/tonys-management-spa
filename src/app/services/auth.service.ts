import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from '@tonys-barbers/shared';
import { EmployeeService } from '../models/employee/employee.service';
import { CompanyService } from '../models/company/company.service';
import { AppStateService } from './app-state.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiService,
    private jwt: JwtService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private state: AppStateService,
  ) { }

  async login(username: string, password: string): Promise<void> 
  {
    const response = await this.api.login({username, password});
    this.jwt.setToken(response.data);

    const employee = await this.employeeService.getAuthed();
    const company = await this.companyService.get(employee.company_id);

    this.state.setEmployee(employee);
    this.state.setCompany(company);
  }

  async logout(): Promise<void>
  {
    
    this.jwt.removeToken();
    this.state.removeCompany();
    
    this.api.logout();
  }


  // TODO: implement
  async register(name: string, email: string, password: string, phone?: string): Promise<any> 
  {
    // const response = await this.api.register({name, email, password, phone});
    // return response; 
  }

  isLoggedIn(): boolean
  {
    return this.jwt.hasToken() && this.jwt.hasValidToken();
  }

  async attemptRefresh(): Promise<void|boolean>
  {
    try
    {
      const response = await this.api.refreshToken({refresh_token: this.jwt.getRefreshToken()});
      this.jwt.setToken(response.data)
    }
    catch
    {
      return false;
    }
  }
}