import * as moment from 'moment';
import { Moment } from 'src/types';


export const secondsFromStartOfDay = (date: Moment): number => {
    return date.unix() - moment().startOf('day').unix();
}