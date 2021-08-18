import * as moment from 'moment';
import { Moment } from 'src/types';


export const secondsSinceStartOfDay = (date: Moment|Date): number => 
{
    return setToMoment(date).unix() - moment().startOf('day').unix();
}

export const minutesSinceStartOfDay = (date: Moment|Date): number => 
{
    return secondsSinceStartOfDay(date) / 60;
}

const setToMoment = (date: Moment|Date): Moment => 
{
    return date instanceof Date ? moment(date) : date;
}