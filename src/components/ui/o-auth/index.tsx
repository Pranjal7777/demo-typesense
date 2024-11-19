import { IMAGES } from '@/lib/images';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
// import {doc,setDoc,getDoc,serverTimestamp} from "firebase/firestore"
import { useRouter } from 'next/router';
// const { auth } = dynamic(() => import("../../../../firebase.config").then((module) => module.default), {
//   ssr: false,
// })
import { auth } from '../../../../firebase.config';
// import { useEffect, useState } from "react";
import Button from '../button';
import Image from 'next/image';
import { gumletLoader } from '@/lib/gumlet';
import { useTranslation } from 'next-i18next';
import { loginWithPhone } from '../../auth/login/login-with-phone';
import { generateDeviceId } from '@/helper/generate-device-id';
import platform from 'platform';
import authApi from '@/store/api-slices/auth';
import { useActions } from '@/store/utils/hooks';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';

const OAuth = () => {
  // const [user, setUser] = useState(null)
  const { t } = useTranslation('auth');
  const loginWithPhoneData = t('page.loginWithPhone', { returnObjects: true }) as loginWithPhone;

  const [login] = authApi.useLoginMutation();
  const { setUserDetailsDispatch } = useActions();

  const router = useRouter();

  const onFacebookClick = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result, 'face');
      
      const user = result.user;
      localStorage.setItem('facebookUser',JSON.stringify(user));
      if (user) {
        const deviceId = generateDeviceId();
        const loginPayloadForFacebook = {
          email: user.email,
          googleId: user.uid ? user.uid : null,
          // facebookId: user.facebookId ? user.facebookId : null,
          deviceId: deviceId,
          deviceMake: platform.name,
          deviceModel: platform.version,
          deviceTypeCode: 3,
          deviceOs: platform?.os?.family + '-' + platform?.os?.version,
          appVersion: '1',
          loginType: 3,
          browserVersion: platform.version,
        };
       
        const { data } = await login(loginPayloadForFacebook).unwrap();
        
        if (data) {
          localStorage.removeItem('facebookUser');
          setUserDetailsDispatch(data);
          router.push('/');
        }   
  
      }

    } catch (e) {
      console.log(e ,'face');
      
      console.error('Error while facebook login', e);
      const error = e as { data: { message: string },status:number };
      if(error.status == 412 || error.status==413){
        router.push(`${SIGN_IN_PAGE}?step=3`);
        return;
      }
    }
  };

  const onGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('googleUser', JSON.stringify(user));
      if (user) {
        const deviceId = generateDeviceId();
        const loginPayloadForGoogle = {
          email: user.email,
          googleId: user.uid ? user.uid : null,
          // facebookId: user.facebookId ? user.facebookId : null,
          deviceId: deviceId,
          deviceMake: platform.name,
          deviceModel: platform.version,
          deviceTypeCode: 3,
          deviceOs: platform?.os?.family + '-' + platform?.os?.version,
          appVersion: '1',
          loginType: 3,
          browserVersion: platform.version,
        };
        const { data } = await login(loginPayloadForGoogle).unwrap();
        
        if (data) {
          localStorage.removeItem('googleUser');
          setUserDetailsDispatch(data);
          router.push('/');
        }
      }
    } catch (e) {
      const error = e as { data: { message: string }, status: number };
      if (error.status == 422) {
        router.pathname === SIGN_UP_PAGE ? router.push(`${SIGN_UP_PAGE}?step=2`) : router.push(`${SIGN_IN_PAGE}?step=4`);
        return;
      } else if (error.status === 413 || error.status === 412) {
        router.pathname === SIGN_UP_PAGE ? router.push(`${SIGN_UP_PAGE}?step=3`) : router.push(`${SIGN_IN_PAGE}?step=4`);
        return;
      }
      router.push(`${SIGN_UP_PAGE}?step=2`);
      console.log('error while google login ', e);
    }
  };

  return (
    <div className=" flex flex-col w-full items-center justify-between">
      <Button buttonType="tertiary" onClick={onGoogleClick}>
        <Image
          className="absolute left-3"
          width={20}
          height={20}
          src={`${IMAGES.GOOGLE_LOGO}`}
          // loader={gumletLoader}
          alt="google_logo"
        />
        <span className="text-[16px] leading-6 ml-2 rtl:ml-0 rtl:mr-2">
          {router.pathname === SIGN_UP_PAGE ? 'Sign up ' : 'Continue '} with {loginWithPhoneData.google}
        </span>
      </Button>

      <Button buttonType="tertiary" onClick={onFacebookClick}>
        <Image
          className="absolute left-3"
          width={20}
          height={20}
          src={`${IMAGES.FACEBOOK_LOGO}`}
          // loader={gumletLoader}
          alt="facebook_logo"
        />
        <span className="text-[16px] leading-6 ml-2 rtl:ml-0 rtl:mr-2">
          {router.pathname === SIGN_UP_PAGE ? 'Sign up ' : 'Continue'} with {loginWithPhoneData.facebook}
        </span>
      </Button>
    </div>
  );
};

export default OAuth;
