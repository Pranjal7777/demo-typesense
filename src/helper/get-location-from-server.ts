import { AUTH_URL_V1, BASE_API_URL } from '@/config';
import { MyLocationFromIp } from '@/store/types/location-types';
import { IncomingMessage } from 'http';

//TODO: fix this code for better code

export const getMyIP = async (req: IncomingMessage | undefined): Promise<string> => {
  if (!req) {
    return '45.127.46.85';
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  if (typeof ip === 'string') {
    if (ip === '::1') {
      return '45.127.46.85';
    } else {
      const newIp = ip.split(',');
      if (newIp && newIp.length > 0) {
        return newIp[0].trim();
      } else {
        return ip.trim() || '45.127.46.85';
      }
    }
  } else {
    return '45.127.46.85';
  }
};
export const getLocationData = async (req: IncomingMessage | undefined): Promise<MyLocationFromIp> => {
  const ip = await getMyIP(req);
  return new Promise((res, rej) => {
    fetch(`${BASE_API_URL}${AUTH_URL_V1}/usersCurrentLocation/?ipAddress=${ip}`)
      .then((data) => data.json())
      .then((data) => {
        return res(data.data);
      })
      .catch((err) => {
        rej();
        console.error(err);
      });
  });
};
