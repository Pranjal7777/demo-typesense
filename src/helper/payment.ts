import { AUTH_URL_V1, BASE_API_URL } from '@/config';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

type getChatIdentifierProps = {
  sellerId: string;
  assetId: string;
  buyerId: string;
  isExchange: boolean;
  userLocation: any;
};

export const getCleanToken = (token: string | undefined) => {
  if (!token) return null;
  if (token.includes('%20')) {
    return decodeURIComponent(token).replace('', '');
  }
  return token.split('"')[1] || token;
};

export const getChatIdentifier = async ({
  sellerId,
  assetId,
  buyerId,
  isExchange,
  userLocation,
}: getChatIdentifierProps) => {
  const accessToken = getCleanToken(Cookies.get('accessToken'));
  
  if (!accessToken) {
    throw new Error('Access token not found');
  }
  try {
    const identifier = `${assetId}_${sellerId}_${buyerId}`;

    const response = await fetch(
      `${BASE_API_URL}${AUTH_URL_V1}/groupChat?identifier=${encodeURIComponent(identifier)}&isExchange=${isExchange}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`,
          'Platform': '3',
          'Lan': 'en',
          'City': userLocation.city || '',
          'Country': userLocation.country || '',
          'Ipaddress': userLocation.ip || '0.0.0.0',
          'Latitude': userLocation.latitude || '',
          'Longitude': userLocation.longitude || ''
        },
      }
    );
    
    if (!response.ok) {
      let responseBody = await response.json();
      throw new Error(`${responseBody.message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat identifier:', error);
    toast.error(error as string);
    // throw error; 
  }
};

export const getStripePaymentKeys = async (payload: any, userLocation: any) => {
  const accessToken = getCleanToken(Cookies.get('accessToken'));

  if (!accessToken) {
    toast.error('Session expired. Please login again.');
    throw new Error('Access token not found');
  }

  try {
    const response = await fetch(`${BASE_API_URL}${AUTH_URL_V1}/payment/buyDirect/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`,
        'Platform': '3',
        'Lan': 'en',
        'City': userLocation?.city || '',
        'Country': userLocation?.country || '',
        'Ipaddress': userLocation?.ip || '0.0.0.0',
        'Latitude': userLocation?.latitude || '',
        'Longitude': userLocation?.longitude || ''
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Payment processing failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!data?.data?.paymentIntentData?.clientSecret) {
      toast.error('Invalid payment response from server');
      throw new Error('Payment intent data not found');
    }

    return data;
  } catch (error: any) {
    console.error('API Error: payment method:', error);
    const errorMessage = error?.message || 'Payment processing failed';
    toast.error(errorMessage);
    throw error;
  }
};
