import { Injectable } from "@angular/core";
import { Employee } from "../models/employee/employee.model";
import { AppStateService } from "./app-state.service";

@Injectable({providedIn: 'root'})
export class AuthedUserService {
    
    private _employee: Employee;

    constructor(private appState: AppStateService) 
    {
        this.appState.employee$.subscribe(res => this._employee = res);
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
}