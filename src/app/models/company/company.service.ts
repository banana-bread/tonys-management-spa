import { Injectable } from '@angular/core';
import { Company } from './company.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  
  constructor(private api: ApiService) {}

  async get(id: string): Promise<Company>
  {
    const response = await this.api.getCompany(id);

    return new Company(response.data.company);
  }

  async updateProfile(company: Company): Promise<Company>
  {
    const response = await this.api.updateCompany(company);

    return new Company(response.data.company);
  }

  async updateEmployees(company: Company): Promise<Company>
  {
    const response = await this.api.updateCompanyEmployees(company.employees);

    return new Company(response.data.company);
  }
}
