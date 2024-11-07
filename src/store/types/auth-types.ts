export interface Token{
    accessExpireAt:number,
    accessToken:string,
    refreshToken:string
}

export interface GetGuestTokenConfig {
    deviceId: string;
    deviceMake: string;
    deviceModel: string;
    deviceTypeCode: number;
    deviceOs: string;
    appVersion: string;
    browserVersion: string;
}

export interface ResponseGetGuestTokenPayload {
    data:{
        token:Token,
    }
}

export interface OtpData{
    countryCode:string,
    phoneNumber:string,
} 


export interface RequestSendVerificationCodePayload extends OtpData{
    trigger:number,
}
export interface RequestSendVerificationCodeForLoginWithPhone extends OtpData{
    trigger:number,
    loginType:number
}
export interface RequestSendVerificationCodeForLoginWithEmail {
    trigger:number,
    loginType: number
    email:string
}

export interface RequestResendOtpData{
    countryCode?:string,
    phoneNumberOrEmail:string,
    verificationId:string,
    expiryTime:number
    loginType:string //@todo typescript
}


export interface RequestReSendVerificationCodePayload {
    countryCode?:string,
    emailOrPhone:string,
    trigger:number,
    type:number,
}




export interface OtpDataWithVerificationId {
    countryCode:string,
    phoneNumberOrEmail:string,
    verificationId:string,
    expiryTime:number,
    loginType:number
}
export interface OtpDataWithVerificationForSignUp extends OtpData{
    // countryCode:string,
    // phoneNumber:string,
    verificationId:string,
    expiryTime:number,
}

export interface RequestPayloadForSignUp{
    inviteReferralCode?: string | undefined;
    email: string | null;
    // password: string | null;
    accountType: string;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    countryCode: string;
    country: string;
    deviceId : string,
    deviceMake:string | undefined,
    deviceModel:string | undefined,
    deviceOs:string,
    deviceTypeCode:number,
    appVersion:string,
    isAdmin:number,
    loginType:number,
    termsAndCond:number,
}

// export interface OtpDataWithVerificationId extends OtpData{
//     // countryCode:string,
//     // phoneNumber:string,
//     verificationId:string,
// }



export interface RequestLoginPayload{
    countryCode: string,
    phoneNumber: string,
    verificationId: string,
    password: string,
    appVersion: string,
    loginType: string,
    deviceOs: string,
    browserVersion: string,
    deviceTypeCode: number,
    deviceId: string,
    deviceMake: string,
    deviceModel: string,
  }

export interface RequestLoginPaylodWithEmail{
    password: string,
    verificationId:string
    appVersion: string,
    loginType: number,
    deviceOs: string,
    browserVersion: string,
    deviceTypeCode: number,
    deviceId: string,
    deviceMake: string,
    deviceModel: string,
    email:string,
 } 
export interface RequestLoginPaylodWithGoogle{
   
    email: string | null;
    googleId: string | null;
    deviceId: string;
    deviceMake: string | undefined;
    deviceModel: string | undefined;
    deviceTypeCode: number;
    deviceOs: string;
    appVersion: string;
    loginType: number;
    browserVersion: string | undefined;
 } 

 

  
export  interface ResponseLoginPayload{
    data:{
    token:Token,
    user: User,
  }
}

export interface RequestLogoutPayload{
    deviceId:string,
    refreshToken:string
  }

export interface RequestValidateEmail{
    email:string,
}
  
export interface ResponseLogoutPayload{
    data : Record<string, never>,
    message:string
}

export  interface ResponseSetUserDetailsDispatchPayload{
    token:Token,
    user: User,
}

export interface User{
    accountId:string,
    accountType:string,
    accountLegalName:string,
    country:string,
    countryCode:string,
    defaultCurrency:string,
    email:string,
    fcmTopic:string,
    firstName:string,
    fullName:string,
    googleId:string,
    isProfileComplete:boolean,
    lastName:string,
    location:{lat:number,lon:number},
    mqttTopic:string,
    noOfAds:string,
    noOfVideos:string,
    phoneNumber:string,
    profileLink:string,
    referralCode:string,
    subscription:{
      isSubscribed:boolean,
    },
    username:string,
    _id:string,
}



export interface ResponseSendVerificationCodePayload{
    data:{
        verificationId:string,
        expiryTime:number,
    }
}
export interface RequestSignUpPayload{
    accounType:string,
    appVersion:	string,
    country	:string,
    countryCode	:string,
    deviceId:	string
    deviceMake:string,
    deviceModel	:string,
    deviceOs	:string,
    deviceTypeCode:number
    email	:string,
    firstName	:string,
    isAdmin	:number
    lastName	:string,
    loginType	:number
    password	:string,
    phoneNumber	:string,
    username	:string,
  }
  
  
export interface RequestValidVerificationCodePayload{
//     countryCode:string,
//     phoneNumber:string,
//     trigger:number,
//     code:string,
//   verificationId:number,
code: string;
countryCode: string;
phoneNumber: string;
verificationId: string | null;
trigger: number;
  }

export interface RequestForgotPasswordPayload{
    emailOrPhone:string,
    type:number,
  }

export interface ResponseForgotPasswordPayload{
    data:{
        expiryTime: number,
        userId:string,
        verificationId:string,
    },
    message:string
  }

  
export interface ResponseValidVerificationCodePayload{
        message:string
}

export interface MyLocation{
    fullAddress:string
    latitude:number,
    longitude:number
}

export interface myLocationField{
    address:string,
    latitude:string,
    longitude:string,
    city:string,
    country:string,
}
export interface myLocationFieldWithIp  extends  myLocationField{
    ip:string | null;
}