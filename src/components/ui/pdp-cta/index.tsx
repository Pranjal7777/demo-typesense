import { useTheme } from '@/hooks/theme';
import ChatIcon from '../../../../public/assets/svg/chat-icon';
import Button from '../button';
import React, { useEffect, useRef, useState } from 'react';
// import 'isomtrik-quickchat';
// import 'isomtrik-quickchat/css';
// import { initializeChat } from 'isomtrik-quickchat/utils';
// import { createChatUserDetails, createConversation, getChatUsers, getChatUserToken } from '@/lib/chat-sdk';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/router';
// import { ChatUser } from '@/store/types/chat-sdk-type';
import { ISOMETRIK_CHAT_CONFIG, STATIC_IMAGE_URL } from '@/config';
import FullScreenSpinner from '../full-screen-spinner';
import { StickyHeaderDetails } from '@/containers/pdp';
type PdpCtaProps = {
  firstButtonText: string;
  secondButtonText?: string;
  noStockButtonText?: string;
  isSold?: boolean;
  handleFirstButtonClick?: () => void;
  isFirstButtonLoading?: boolean;
  apiData?: any;
  setStickyHeaderDetails?: React.Dispatch<React.SetStateAction<StickyHeaderDetails>>;
  stickyHeaderDetails?: StickyHeaderDetails;
};
const PdpCta: React.FC<PdpCtaProps> = ({
  isSold,
  firstButtonText,
  secondButtonText,
  noStockButtonText,
  isFirstButtonLoading,
  handleFirstButtonClick,
  apiData,
  setStickyHeaderDetails,
  stickyHeaderDetails
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [loadingChat, setLoadingChat] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const props = {
    // baseUrl: "https://apis.isometrik.io",
    hostUrl: 'wss://connections.isometrik.ai:2086/mqtt',
    licenseKey: ISOMETRIK_CHAT_CONFIG.licenseKey || '',
    appSecret: ISOMETRIK_CHAT_CONFIG.appSecret || '',
    userSecret: ISOMETRIK_CHAT_CONFIG.userSecret || '',
    userToken: '',
    isometrikUserId: '', // mir
    projectId: ISOMETRIK_CHAT_CONFIG.projectId || '',
    keysetId: ISOMETRIK_CHAT_CONFIG.keysetId || '',
    accountId: ISOMETRIK_CHAT_CONFIG.accountId || '',
    conversationId: '',
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Example breakpoint for mobile
    };

    handleResize(); // Initial check

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const chatIconClickHandler = async () => {
    // if (userInfo) {
    //   const profilePic = apiData?.images[0]?.url.includes('https')
    //     ? apiData?.images[0]?.url
    //     : `${STATIC_IMAGE_URL}/${apiData?.images[0]?.url}`;
    //   const chatCreds: any = {};
    //   const userName = userInfo.username.charAt(0).toUpperCase() + userInfo.username.slice(1).toLowerCase();
    //   let password = userName + apiData?._id.slice(-5);
    //   let userIdentifier = `${userInfo.username}${apiData?._id}`;
    //   try {
    //     setLoadingChat(true);
    //     const users = await getChatUsers();
    //     const userData = users.users.find((user: ChatUser) => user.userIdentifier === userIdentifier);
    //     if (userData) {
    //       try {
          
    //         const tokenData = await getChatUserToken(userData.userIdentifier, password);
    //         chatCreds.userToken = tokenData.userToken;
    //         chatCreds.isometrikUserId = tokenData.userId;
    //         try {
    //           const conversation = await createConversation(tokenData.userToken, {
    //             typingEvents: true,
    //             searchableTags: [apiData?.title || '', apiData?._id || '', apiData?.description || ''],
    //             readEvents: true,
    //             pushNotifications: true,
    //             metaData: {
    //               'open conversation': true,
    //             },
    //             members: [ISOMETRIK_CHAT_CONFIG.adminId],
    //             isGroup: false,
    //             customType: 'Test conversations',
    //             conversationType: 0,
    //             conversationTitle: apiData?.title || `${apiData?.description}`,
    //             conversationImageUrl: profilePic,
    //           });
              
    //             initializeChat({
    //               ...props,
    //               conversationId: conversation.conversationId,
    //               isometrikUserId: chatCreds.isometrikUserId,
    //               userToken: chatCreds.userToken,
    //             });
    //         } catch (error) {
    //           console.log(error);
    //         }
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     } else {
    //       try {
    //         const userDetails = await createChatUserDetails({
    //           userIdentifier: userIdentifier,
    //           password: password,
    //           userName: apiData?.title || `${apiData?.description}`,
    //           userProfileImageUrl: profilePic,
    //         });
    //         if (userDetails) {
    //           chatCreds.userToken = userDetails.userToken;
    //           chatCreds.isometrikUserId = userDetails.userId;
    //           try {
    //             const conversation = await createConversation(userDetails.userToken, {
    //               typingEvents: true,
    //               searchableTags: [apiData?.title || '', apiData?._id || '', apiData?.description || ''],
    //               readEvents: true,
    //               pushNotifications: true,
    //               metaData: {
    //                 'open conversation': true,
    //               },
    //               members: [ISOMETRIK_CHAT_CONFIG.adminId],
    //               isGroup: false,
    //               customType: 'Test conversations',
    //               conversationType: 0,
    //               conversationTitle: apiData?.title || `${apiData?.description}`,
    //               conversationImageUrl: profilePic,
    //             });

    //             initializeChat({
    //               ...props,
    //               conversationId: conversation.conversationId,
    //               isometrikUserId: chatCreds.isometrikUserId,
    //               userToken: chatCreds.userToken,
    //             });
    //           } catch (error) {
    //             console.log(error);
    //           }
    //         }
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   finally{
    //     setLoadingChat(false);
    //   }
    // } else {
    //   router.push('/login');
    // }
  };


  const buttonsRef = useRef<HTMLDivElement>(null);


      useEffect(() => {
        const updatePosition = () => {
          if (!buttonsRef.current) return;

          const buttonsRect = buttonsRef.current.getBoundingClientRect();

          setStickyHeaderDetails?.((prevDetails) => {
            let newDetails = { ...prevDetails };

            // Set showProductImage to true when the imageElement is either scrolled past 145px from the top or completely out of viewport
            if (buttonsRect.top <= 235 || buttonsRect.bottom < 0) {
              newDetails.showButtons = true;
            } else {
              newDetails.showButtons = false;
            }

            // Update state only if there's a change
            if (
              newDetails.showButtons !== prevDetails.showButtons
            ) {
              return newDetails;
            }
            return prevDetails;
          });
        };

        updatePosition(); // Initial update when component mounts
        window.addEventListener('scroll', updatePosition);

        return () => {
          window.removeEventListener('scroll', updatePosition);
        };
      }, []);

  return (
    <div className={`flex w-full gap-2 ${isSold ? 'mt-0' : 'mt-5'} justify-around`} ref={buttonsRef}>
      {!isSold ? (
        <>
          <Button
            isLoading={isFirstButtonLoading}
            onClick={handleFirstButtonClick}
            className={`${secondButtonText ? 'w-[15rem] mobile:w-[12rem]' : 'w-[90%]'} text-sm mb-0`}
          >
            {firstButtonText}
          </Button>
          {secondButtonText && (
            <Button className="w-[15rem] mobile:w-[12rem] text-sm mb-0" buttonType="secondary">
              {secondButtonText}
            </Button>
          )}

          <ChatIcon
            onClick={chatIconClickHandler}
            bgFillcolor={theme.theme ? '#fff' : '#F4F4F4'}
            size={isMobile ? 'mobile' : 'pc'}
          />
        </>
      ) : (
        <div className="w-full">
          <Button buttonType="disabledBtn" isDisabled={true} className="!cursor-not-allowed w-full">
            {noStockButtonText}
          </Button>
        </div>
      )}
      {loadingChat && <FullScreenSpinner />}
    </div>
  );
};

export default PdpCta;
