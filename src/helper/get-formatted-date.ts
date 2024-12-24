import { DATE_AND_TIME_FORMAT } from '@/constants/config-strings';
import moment from 'moment'; 
export const getFormattedDate = (date: string, formatType: string = DATE_AND_TIME_FORMAT): string => {
    if(date){
        return moment(date).local().format(formatType);
    }
    return '';
};

export const getFormattedDateFromTimestamp = (timestamp: number): string => {
    // Multiply by 1000 to convert to milliseconds if timestamp is in seconds
    if(timestamp){
        const date = moment.unix(timestamp);
        return date.format('D MMM, YYYY');
    }
    return '';
};





