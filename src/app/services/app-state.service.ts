import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Company } from "../models/company/company.model";
import { Employee } from "../models/employee/employee.model";

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private _company: Company;
    private _employee: Employee;

    set company(company: Company)
    {
        this._company = company;
    }

    get company(): Company
    {
        return this._company;
    }

    set employee(employee: Employee)
    {
        this._employee = employee;
    }

    get employee(): Employee
    {
        return this._employee;
    }
}