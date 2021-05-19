import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Company } from "../models/company/company.model";

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    company: Subject<Company> = new Subject();

    setCompany(company: Company)
    {
        this.company.next(company);
    }
}