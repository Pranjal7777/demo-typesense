import React, { useEffect } from 'react'
import 'isometrik-webchat';
import 'isometrik-webchat/css';
import { initializeChat } from 'isometrik-webchat/utils'; 
import { ISOMETRIK_CHAT_CONFIG } from '@/config';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import Header from '@/components/sections/header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Chat = () => {
      const { userInfo } = useAppSelector((state: RootState) => state.auth);

const chatProps = {
  //   hostUrl: 'wss://connections.isometrik.ai:2086/mqtt',
  licenseKey: ISOMETRIK_CHAT_CONFIG.licenseKey || '',
  appSecret: ISOMETRIK_CHAT_CONFIG.appSecret || '',
  userSecret: ISOMETRIK_CHAT_CONFIG.userSecret || '',
  userToken: userInfo?.isometrikResp?.userToken || '',
  isometrikUserId: userInfo?.isometrikUserId || userInfo?.isometrikResp?.userId || '',
  projectId: ISOMETRIK_CHAT_CONFIG.projectId || '',
  keysetId: ISOMETRIK_CHAT_CONFIG.keysetId || '',
  accountId: ISOMETRIK_CHAT_CONFIG.accountId || '',
  containerId: 'chat-body-container',
  isMakeOffer: true,
//   isAdmin: false,
};
    

    useEffect(()=>{
      setTimeout(()=>{
        initializeChat(chatProps)
      },3000)
    },[])

  return (
    <div className="w-full bg-[#FFF] dark:bg-bg-primary-dark">
      <div className="w-full hidden md:block">
        <Header stickyHeaderWithSearchBox />
      </div>
      <div className="h-fit mt-0 md:mt-[69px] sm:px-[64px] max-w-[1440px] mx-auto">
        <div className="w-full h-[100vh] md:h-[calc(100vh-69px)]" id="chat-body-container"></div>
      </div>
    </div>
  );
}

export default Chat;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}