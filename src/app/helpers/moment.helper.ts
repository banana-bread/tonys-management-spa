import * as moment from 'moment';
import { Moment } from 'src/types';


export const secondsSinceStartOfDay = (date: Moment|Date): number => 
{
    return setToMoment(date).unix() - moment(setToMoment(date)).startOf('day').unix();
}

export const minutesSinceStartOfDay = (date: Moment|Date): number => 
{
    return secondsSinceStartOfDay(date) / 60;
}

export const toEnglishDay = (date: Moment|Date): string =>
{
    return setToMoment(date).format('dddd').toLowerCase();
}

const setToMoment = (date: Moment|Date): Moment => 
{
    return date instanceof Date ? moment(date) : date;
}
