import { CHAT_CONVERSATION, CHAT_USER_DETAILS, CHAT_USER_TOKEN, CHAT_USERS } from '@/api/endpoints';
import { ISOMETRIK_CHAT_API_BASE_URL, ISOMETRIK_CHAT_CONFIG } from '@/config';
import { ChatUsersResponse } from '@/store/types/chat-sdk-type';

export const createChatUserDetails = async (userDetails: {
  userIdentifier: string;
  password: string;
  userName: string;
  userProfileImageUrl: string;
}) => {
  try {
    const response = await fetch(`${ISOMETRIK_CHAT_API_BASE_URL}${CHAT_USER_DETAILS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        appSecret: `${ISOMETRIK_CHAT_CONFIG.appSecret}`,
        licenseKey: `${ISOMETRIK_CHAT_CONFIG.licenseKey}`,
        userSecret: `${ISOMETRIK_CHAT_CONFIG.userSecret}`,
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    const data = await response.json();
    return data;

  } catch (error) {
    return error;
  }
};


export const getChatUsers = async () => {
  try {
    const response = await fetch(`${ISOMETRIK_CHAT_API_BASE_URL}${CHAT_USERS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        appSecret: `${ISOMETRIK_CHAT_CONFIG.appSecret}`,
        licenseKey: `${ISOMETRIK_CHAT_CONFIG.licenseKey}`,
        userSecret: `${ISOMETRIK_CHAT_CONFIG.userSecret}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    return error;
  }
}

export const getChatUserToken = async (userIdentifier: string, password: string) => {
  try {
    const response = await fetch(`${ISOMETRIK_CHAT_API_BASE_URL}${CHAT_USER_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        appSecret: `${ISOMETRIK_CHAT_CONFIG.appSecret}`,
        licenseKey: `${ISOMETRIK_CHAT_CONFIG.licenseKey}`,
        userSecret: `${ISOMETRIK_CHAT_CONFIG.userSecret}`,
      },
      body: JSON.stringify({
        userIdentifier: userIdentifier,
        password: password,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}


export const createConversation = async (userToken: string, body: any) => {
  try {
    const response = await fetch(`${ISOMETRIK_CHAT_API_BASE_URL}${CHAT_CONVERSATION}`, {
      method: 'POST',
      headers: {    
        'Content-Type': 'application/json',
        appSecret: `${ISOMETRIK_CHAT_CONFIG.appSecret}`,
        licenseKey: `${ISOMETRIK_CHAT_CONFIG.licenseKey}`,
        userToken: `${userToken}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}


