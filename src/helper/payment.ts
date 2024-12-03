import { AUTH_URL_V1, BASE_API_URL, DEFAULT_LOCATION } from '@/config';
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
    return null;
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
          'City': userLocation.city || DEFAULT_LOCATION.city,
          'Country': userLocation.country || DEFAULT_LOCATION.country,
          'Ipaddress': userLocation.ip || DEFAULT_LOCATION.ip,
          'Latitude': userLocation.latitude || DEFAULT_LOCATION.latitude,
          'Longitude': userLocation.longitude || DEFAULT_LOCATION.longitude
        },
      }
    );
    
    if (!response.ok) {
      const responseBody = await response.json();
      throw new Error(responseBody.message || 'Failed to fetch chat identifier');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching chat identifier:', error);
    toast.error(error.message || 'Failed to fetch chat identifier');
    return null;
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
        'City': userLocation.city || DEFAULT_LOCATION.city,
        'Country': userLocation.country || DEFAULT_LOCATION.country,
        'Ipaddress': userLocation.ip || DEFAULT_LOCATION.ip,
        'Latitude': userLocation.latitude || DEFAULT_LOCATION.latitude,
        'Longitude': userLocation.longitude || DEFAULT_LOCATION.longitude
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
