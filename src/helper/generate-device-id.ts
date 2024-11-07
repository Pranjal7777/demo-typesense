import { MD5 } from 'crypto-js';

export function generateDeviceId() {
  let platform = '';
  let userAgent = '';
      
    
  if (typeof navigator !== 'undefined') {
    platform = navigator.platform || '';
    userAgent = navigator.userAgent || '';
           
  }
    
  const timezoneOffset = new Date().getTimezoneOffset();
    
  // Combine properties to generate a unique identifier
  const deviceId = platform + userAgent + timezoneOffset ;
    
  // Hash the combined string to ensure it's not easily reversible
  const hashedDeviceId = hashFunction(deviceId);
    
  return hashedDeviceId;
}
      
// Example hash function (replace with your preferred hash algorithm)
function hashFunction(input: string): string  {
  // Example: Simple hash function using the MD5 algorithm
  return MD5(input).toString();
}