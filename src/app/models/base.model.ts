import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { BaseSchedule } from '../helpers/base-schedule.helper';
import { isObject, isArray } from '../helpers/helpers';

// TODO: not a big fan of having to define dates {} prop in concrete models.
//       Think we should use a decorator.
export abstract class BaseModel {
    
    // TODO: typehint
    abstract relations: any;
    abstract dates: any;

    map(data: any) 
    {

        this._mapProperties(data);
        this._mapRelations(data);
        this._mapDates(data);
        // TODO: improve
        this._mapBaseSchedule();
    }

    private _mapDates(attributes: any)
    {
        if (! this.hasOwnProperty('dates')) return;
        for (let dateKey in this.dates)
        {
            this[dateKey] = moment(moment().format(attributes[dateKey]))
        }
    }

    private _mapProperties(attributes: any)
    {
        Object.keys(this).forEach(key => {
            // If key is a relation, skip here.
            if (key === 'relations' || key === 'dates' || this.relations[key] || this.dates[key])
            {
                return;
            } 

            this[key] = attributes[key];
        });  
    }

    // TODO: should check that relation is of type array
    private _mapRelations(attributes: any)
    {
        for (let relation in this.relations)
        {
            // Relation is a single object
            if (isObject(attributes[relation]))
            {
                this[relation] = new this.relations[relation](attributes[relation])
            }

            // Relation is an array of objects
            if (isArray(attributes[relation]) && isArray)
            {
                this[relation] = attributes[relation]
                    .map((obj: any, index: number) => {
                        return new this.relations[relation](attributes[relation][index]);
                    });
            }
        }    
    }

    private _mapBaseSchedule()
    {
        if (this.hasOwnProperty('base_schedule') && this['settings'] && this['settings']['base_schedule'])
        {
            this['base_schedule'] = new BaseSchedule(this['settings']['base_schedule']);
        }
    }

    copy(): this
    {
        return cloneDeep(this);
    }
}
