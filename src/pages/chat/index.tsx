import React, { useEffect } from 'react'
import 'isometrik-webchat';
import 'isometrik-webchat/css';
import { initializeChat } from 'isometrik-webchat/utils'; 
import { ISOMETRIK_CHAT_CONFIG } from '@/config';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';

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
//   isMakeOffer: true,
//   isAdmin: false,
};
    

    useEffect(()=>{
        initializeChat(chatProps)
    },[])

  return (
    <div className='h-screen w-screen' id='chat-body-container'></div>
  )
}

export default Chat