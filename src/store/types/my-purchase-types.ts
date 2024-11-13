export type PurchaseMetaData = {
    planType?: string;
    coverageScope?: string;
    coverage?: string;
    countryName?: string;
    radius?: string;
  };

export type PurchaseOrder = {
    _id: string;
    orderDate: string;
    orderTs: number;
    orderId: string;
    productId: string;
    orderType: string;
    image: string;
    productType: string;
    productDescription: string;
    amount: number;
    currency: string;
    buyerId: string;
    sellerId: string;
    buyerAccountId: string;
    sellerAccountId: string;
    expireOn?: number;
    paymentStatus: boolean;
    orderComplete: boolean;
    metaData?: PurchaseMetaData;
    purchasedBy: string;
    productName: string;
    buyerFullName: string;
    sellerFullName: string;
    appCommission?: number;
  };
  
 export type PurchaseResponse = {
    message: string;
    data: PurchaseOrder[];
  };

  export type BillingAddressType = {
    _id: string;
    name: string;
    countryCode: string;
    phoneNumber: string;
    addressTypeAttribute: string;
    addressNotesAttributes?: string[];
    addressTaggedAs?: string;
    streetNo?: string;
    aptNo?: string;
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    lat?: number;
    long?: number;
    note?: string;
    isDefault: boolean;
  }

  export type QrCodeType = {
    code?: string;
    status?: string;
    userId?: string;
    accountId?: string;
    generatedByUserId?: string;
    timeStamp?: number;
  }
  export type PurchaseOrderDetails = {
    _id: string;
    orderDate: string;
    orderTs: number;
    orderId: string;
    chatId?: string;
    productId?: string;
    productType?: string;
    appCommission?: number;
    orderType: string;
    image?: string;
    productDescription?: string;
    amount?: number;
    currency?: string;
    billingAddress?: BillingAddressType;
    paymentType?: string;
    paymentTypeText?: string;
    buyerId?: string;
    sellerId?: string;
    sellerAccountId?: string;
    buyerAccountId?: string;
    purchasedByUserId?: string;
    soldByUserId?: string;
    orderComplete: boolean;
    qrCode?: QrCodeType;
    buyerInvoiceUrl?: string;
    sellerInvoiceUrl?: string;
    invoiceUrl?: string;
    buyerFullName?: string;
    purchasedByUserFullName?: string;
    productName?: string;
    sellerFullName?: string;
    sellerProfilePic?: string;
    soldByUserFullName?: string;
    cancelBy?: string;
    cancelReason?: string;
    cancelledDate?: string;
    cancelledOn?: number;
    reviewRatingId?: string;
    avgRating?: number | string;
    review?: string | null;
    rating?: Array<{
      parameterId: string;
      rating: number;
    }>;
    exchangeProductId?: string;
    exchangeImageUrl?: string;
    exchangeProductName?: { [key: string]: string };
    exchangeDescription?: string;
  }
  export type PurchaseDetailsResponse = {
    message: string;
    data: PurchaseOrderDetails;
  };
  
  