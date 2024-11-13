
import { DATE_AND_TIME_FORMAT } from '@/constants/config-strings';
import moment from 'moment'; 
export const getFormattedDate = (date: string, formatType: string = DATE_AND_TIME_FORMAT): string => {
    if(date){
        return moment(date).local().format(formatType);
    }
    return '';
};



