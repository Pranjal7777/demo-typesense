
import { parsePhoneNumber } from 'awesome-phonenumber';
const validatePhoneNumber = (number: string): boolean =>  {
  const pn = parsePhoneNumber( number);
 return pn.valid
};

export default validatePhoneNumber;
