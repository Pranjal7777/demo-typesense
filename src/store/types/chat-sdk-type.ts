export type ChatUser = {
  visibility: boolean;
  userProfileImageUrl: string;
  userName: string;
  userIdentifier: string;
  userId: string;
  updatedAt: number;
  online: boolean;
  notification: boolean;
  metaData: Record<string, unknown>; // Using a flexible type for the metaData object
  lastSeen: number;
  language: string;
  createdAt: number;
};

export type ChatUsersResponse = {
  users: ChatUser[];
  msg: string;
};
