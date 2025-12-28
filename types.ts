export interface OTPAccount {
  id: string; // Should be UUID format
  serviceName: string;
  accountName: string;
  secretKey: string;
  issuer?: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

export enum ModalType {
  NONE,
  ACCOUNT_FORM,
  SETTINGS,
  QR_SCANNER,
  EXPORT_QR,
  ABOUT,
}

export interface AppSettings {
  cloudSyncEnabled: boolean;
  syncServerUrl: string;
  syncUsername: string;
  syncPassword?: string; // This is the master password used for E2EE
}
