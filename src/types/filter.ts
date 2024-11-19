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