import { Injectable } from "@angular/core";
import { id } from "date-fns/locale";
import { Employee } from "../models/employee/employee.model";
import { AppStateService } from "./app-state.service";

@Injectable({providedIn: 'root'})
export class AuthedUserService {
    
    private _employee: Employee;

    constructor(private appState: AppStateService) 
    {
        this.appState.employee$.subscribe(res => this._employee = res);
    }

    get user$()
    {
        return this.appState.employee$;
    }

    canViewAllEmployees(): boolean
    {
        return this._employee?.isAdmin();
    }

    canViewServices(): boolean
    {
        return this._employee?.isAdmin();
    }

    canViewShop(): boolean
    {
        return this._employee?.isOwner();
    }

    canUpgradeEmployeesToAdmin(): boolean
    {
        return this._employee?.isOwner();
    }
    
    canUpgradeEmployeesToOwner(): boolean
    {
        return this._employee?.isOwner();
    }

    canAlterEmployeeBooking(employee: Employee): boolean
    {
        return this._employee?.isAdmin() || this._employee?.id === employee.id;
    }

    isAdmin(): boolean
    {
        return this._employee.admin;
    }

    is(employee: Employee|string): boolean
    {
        if (employee instanceof Employee)
        {
            return this._employee.id === employee.id
        }

        return this._employee.id === employee;
    }
}