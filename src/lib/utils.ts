import { twMerge } from 'tailwind-merge';
import {clsx,ClassValue} from 'clsx';

export function appClsx(...inputs:ClassValue[]){
  return twMerge(clsx(inputs));
}
