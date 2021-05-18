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
}
