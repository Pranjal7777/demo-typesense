
export interface AddressType {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressNotesAttributes: string[];
    addressTaggedAs: string;
    addressTypeAttribute: string;
    aptNo: string;
    city: string;
    country: string;
    countryCode: string;
    isDefault: boolean;
    lat: number;
    long: number;
    name: string;
    note: string;
    phoneNumber: string;
    state: string;
    streetNo: string;
    zipCode: string;
    _id: string;
}

export type UserInfoType = AddressType & {
    countryShortForm?: string; // Additional property
  };

export interface ResponseAddress {
    message: string;
    data: AddressType[];
}
// deleteError?.data?.message
export type AddressErrorType = {
  data:{
    message: string,
  }
}

