import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { BaseSchedule } from '../helpers/base-schedule.helper';
import { isObject, isArray } from '../helpers/helpers';
import { ApiService } from '../services/api.service';

// TODO: not a big fan of having to define dates {} prop in concrete models.
//       Think we should use a decorator.
export abstract class BaseModel {
    
    // TODO: typehint
    abstract id?: any;
    abstract relations: any;
    abstract dates: any;
    static api: ApiService;


    map(data: any) 
    {
        this._mapProperties(data);
        this._mapRelations(data);
        this._mapDates(data);
        // TODO: improve
        this._mapBaseSchedule();
    }

    /**
     * remove unnecessary attributes from model before saving to api
     * 
     */
    // strip()
    // {
    //   for (const key in this.relations)
    //   {
    //     const relation = this[key]

    //     if (!relation) continue

    //     isArray(relation) 
    //       ? relation.forEach(rel => rel.strip()) 
    //       : relation.strip()
    //   }

    //   delete this.dates
    //   delete this.relations
    // }

    exists(): boolean
    {
      return !!this.id
    }

    private _mapDates(attributes: any)
    {
        if (! this.hasOwnProperty('dates')) return;
        for (let dateKey in this.dates)
        {
            this[dateKey] = moment(attributes[dateKey]).toDate();
        }
    }

    private _mapProperties(attributes: any)
    {
        Object.keys(this).forEach(key => {
            // If key is a relation, skip here.
            if (key === 'relations' || key === 'dates' || this.relations[key] || this.dates[key] || !attributes)
            {
                return;
            } 

            this[key] = attributes[key];
        });  
    }

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
