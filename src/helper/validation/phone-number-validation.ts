
import { parsePhoneNumber } from 'awesome-phonenumber';
const validatePhoneNumber = (number: string): boolean =>  {
  const pn = parsePhoneNumber( number );
  if(pn.valid){
    return true;
  }
  return false;
};

export default validatePhoneNumber;
