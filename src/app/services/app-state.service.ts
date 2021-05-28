import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Company } from "../models/company/company.model";
import { Employee } from "../models/employee/employee.model";

// https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8
@Injectable({providedIn: 'root'})
export class AppStateService {
    private readonly _employee = new BehaviorSubject<Employee>(new Employee());
    private readonly _company = new BehaviorSubject<Company>(new Company());

    readonly employee$ = this._employee.asObservable();
    readonly company$ = this._company.asObservable();

    get employee(): Employee
    {
        return this._employee.getValue();
    }

    get company(): Company
    {
        return this._company.getValue();
    }

    set employee(val: Employee)
    {
        this._employee.next(val);
    }

    set company(val: Company)
    {
        this._company.next(val);
    }

    setEmployee(employee: Employee)
    {
        this.employee = employee;
    }

    // removeEmployee()
    // {
    //     this.employee = null;
    // }
    
    setCompany(company: Company)
    {
        this.company = company;
    }

    // removeCompany()
    // {
    //     this.company = null;
    // }
}