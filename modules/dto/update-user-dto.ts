export enum USER_ACCOUNT_TYPE {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profilePicture?: string;
    accountType?: USER_ACCOUNT_TYPE;
    category?: string;
}
