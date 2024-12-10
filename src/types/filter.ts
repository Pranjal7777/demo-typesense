export interface FilterParameter {
    name: string;
    data?: Array<{
      name: string;
      value?: string | number;
      penCount?: number;
      maxPrice?: number;
      minPrice?: number;
    }>;
    typeCode: number;
    default: number;
    currency?: string;
    currencySymbol?: string;
    level?: number;
    unit?: string;
    seqId?: number;
  }
  
  export interface FilterParameterResponse {
    data: {
      filters: FilterParameter[];
      currency: string;
      isCategoryParent: boolean;
      message: string;
    };
  }

  export interface ProductReportReasonType {
    status: number;
    statusMsg: string;
    _id: string;
    reason: string;
    userType: number;
  }
  export type ProductReportReasonTypeResponse = {
    data: ProductReportReasonType[];
    message: string;
  };

  export interface PostReportResponse {
    data: {
      message: string;
    };
  }

  export type PostReportPayloadType = {
    reportedId: string;
    city: string;
    reportType: string;
    reportReasonId: string;
    reason: string;
    country: string;
    lat: string;
    long: string;
  };
