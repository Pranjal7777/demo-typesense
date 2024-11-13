import Cookies from 'js-cookie';

const isUserAuthenticated = ()=>{
  const isAuth = Cookies.get('isUserAuth');
  if(!isAuth){
    return false;
  }
  else{
    return true;
  }
};

export default isUserAuthenticated;
