import { ErrorStateType } from '@/pages/profile/address';
import { UserInfoType } from './profile-type';

export type paymentIntentT = {
  publicKey: string;
  clientSecret: string;
  customer: string;
  ephemeralKey: string;
  ephemeralSecret: string;
};


export const initialErrorState: ErrorStateType = {
  name: false,
  city: false,
  state: false,
  phoneNumber: false,
  addressLine1: false,
  country: false,
  aptNo: false,
  addressTypeAttribute: false,
  addressNotesAttributes: false,
};

export const initialFormData: UserInfoType = {
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressNotesAttributes: [],
  addressTaggedAs: '',
  addressTypeAttribute: '',
  aptNo: '',
  city: '',
  country: '',
  countryCode: '',
  countryShortForm: '',
  isDefault: false,
  lat: 1,
  long: 1,
  name: '',
  note: '',
  phoneNumber: '',
  state: '',
  streetNo: '',
  zipCode: '',
  _id: '',
};