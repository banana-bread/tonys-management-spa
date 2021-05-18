import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Company } from "../models/company/company.model";

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    // loading: Subject<boolean> = new Subject<boolean>()

    // setLoading(isLoading: boolean): void
    // {
    //     this.loading.next(isLoading);
    // }

    company: Subject<Company> = new Subject();

    setCompany(company: Company)
    {
        this.company.next(company);
    }
}