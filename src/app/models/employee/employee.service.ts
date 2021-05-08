import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  constructor(private api: ApiService) {}

  async getAll(): Promise<Employee[]> 
  {
    const response = await this.api.getEmployees();
    
    return response.data.employees
      .map((employee: any) => new Employee(employee));
  }
}
