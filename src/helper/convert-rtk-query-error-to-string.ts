import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const convertRTKQueryErrorToString = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if ('data' in error && typeof error.data === 'object' && error.data !== null) {
    return JSON.stringify(error.data);
  }
  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'An unknown error occurred';
};