# OwnAuth

OwnAuth is an open-source, privacy-first mobile authenticator application built for complete data sovereignty. It features strong End-to-End Encryption (E2EE) and allows you to sync your 2FA tokens securely with your own self-hosted cloud server.

<p align="center">
  <img src="./assets/icon.png" width="120" height="120" alt="OwnAuth Logo" />
</p>

## Features

- **🔐 End-to-End Encryption**: Your data is encrypted locally using AES-GCM (256-bit) and PBKDF2 key derivation before it ever leaves your device. The server only sees encrypted blobs.
- **☁️ Self-Hosted Sync**: Sync your OTP codes across devices using your own private server. You own your data.
- **📱 Native Performance**: Built with React Native and compiled to native code for maximum performance and security on iOS and Android.
- **🛡️ Vault Protection**: Secure your tokens with a master password.
- **📵 Offline First**: Works perfectly without an internet connection. Data is stored locally and encrypted.
- **🔄 Secure Account Switching**: Switch between different sync accounts securely with automatic local data wiping to prevent leakage.
- **📷 QR Code Support**: fast scanning for adding accounts and exporting credentials via QR.

## Security Architecture

OwnAuth prioritizes your security above all else:

1.  **Master Password**: Your master password is the key to your vault. It is **never** sent to the server.
2.  **Key Derivation**: We use `PBKDF2` (SHA-256) with unique per-user salts to derive a strong encryption key from your master password.
3.  **AES-GCM Encryption**: All sensitive data (OTP secrets, account names) is encrypted using `AES-GCM` with random IVs before sync.
4.  **Zero-Knowledge Server**: The sync server acts as a dumb store. It cannot decrypt your data because it never possesses your master password or the derived encryption keys.

## Getting Started

### Prerequisites

- Node.js (LTS) & Yarn/Npm
- **iOS**: Xcode & CocoaPods (Mac only)
- **Android**: Android Studio & JDK

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/rosavpn/rosaauth-mobile.git
    cd rosaauth-mobile
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run on iOS** (Mac only)

    ```bash
    # Install Pods
    cd ios && pod install && cd ..

    # Run Simulator
    npm run ios
    ```

4.  **Run on Android**
    ```bash
    npm run android
    ```

## Self-Hosted Server

To enable cloud sync, you need to host the compatible sync server.
👉 **[Get the Sync Server Here](https://github.com/rosavpn/rosaauth-server)**

## Stack

- **Framework**: React Native (via Expo Prebuild)
- **Crypto**: `react-native-quick-crypto` (accessing native OpenSSL/CommonCrypto)
- **Language**: TypeScript
- **Navigation**: React Native Screens / Custom Modals
- **Storage**: Encrypted Async Storage (Conceptually) / Native Filesystem

## License

This project is licensed under the **MIT License**.

---

_Own your authentication._
