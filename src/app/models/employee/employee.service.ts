import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { ApiService } from '../../services/api.service';

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

  async delete(employee: Employee): Promise<void>
  {
    await this.api.deleteEmployee(employee.id);
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

  async updateProfile(employee: Employee, oldPassword = '', newPassword = ''): Promise<any>
  {
    await this.api.updateEmployeeProfile(employee, oldPassword, newPassword);
  }

  async updateActive(employee: Employee)
  {
    await this.api.updateEmployeeActive(employee.id, {bookings_enabled: employee.active});
  }

  async updateBaseSchedule(employee: Employee): Promise<any>
  {
    await this.api.updateEmployeeBaseSchedule({base_schedule: employee.base_schedule.parse()}, employee.id);
  }

  async updateAdmin(employee: Employee): Promise<any>
  {
    employee.admin
      ? await this.api.createEmployeeAdmin(employee.id)
      : await this.api.deleteEmployeeAdmin(employee.id);  
  }

  async updateOwner(employee: Employee): Promise<any>
  {
    employee.owner
      ? await this.api.createEmployeeOwner(employee.id)
      : await this.api.deleteEmployeeOwner(employee.id);  
  }

  async createBlockedTime(employee: Employee, data: any)
  {
    await this.api.createEmployeeBlockedTime(employee.id, data);
  }
}
