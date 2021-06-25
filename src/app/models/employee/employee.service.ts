import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { ApiService } from '../../services/api.service';
import { AppStateService } from 'src/app/services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  constructor(private api: ApiService) {}

  async get(id: string): Promise<Employee>
  {
    const response = await this.api.getEmployee(id);

    return new Employee(response.data.employee);
  }

  async create(companyId: string, expires: string, signature: string, data: any): Promise<Employee>
  {
    const response = await this.api.createEmployee(companyId, expires, signature, data);

    return new Employee(response.data.employee);
  }

  async getAll(): Promise<Employee[]> 
  {
    const response = await this.api.getEmployees();
    
    return response.data.employees
      .map((employee: any) => new Employee(employee));
  }

  async getAuthed(): Promise<Employee>
  {
    const response = await this.api.getAuthedEmployee();

    return new Employee(response.data.employee);
  }

  async invite(emails: string[]): Promise<any>
  {
    await this.api.inviteEmployees({ emails });
  }
}
