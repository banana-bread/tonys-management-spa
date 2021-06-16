import { Injectable } from '@angular/core';
import { Employee } from 'src/app/models/employee/employee.model';

@Injectable({
    providedIn: 'root'    
})
export class StaffEditorService {
    private _staff: Employee;

    get staff(): Employee
    {
        return this._staff;
    }

    set staff(staff: Employee)
    {
        this._staff = staff;
    }
}