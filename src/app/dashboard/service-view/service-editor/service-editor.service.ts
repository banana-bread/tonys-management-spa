import { Injectable } from '@angular/core';
import { ServiceDefinition } from '../../../models/service-definition/service-definition.model';

@Injectable({
    providedIn: 'root'    
})
export class ServiceEditorService {
    private _service: ServiceDefinition;

    get service(): ServiceDefinition
    {
        return this._service;
    }

    set service(service: ServiceDefinition)
    {
        this._service = service;
    }
}
