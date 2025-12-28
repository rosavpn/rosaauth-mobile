import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Vibration
} from 'react-native';
import { install } from 'react-native-quick-crypto';

install(); // Polyfill global.crypto
import {
  Plus,
  Shield,
  Settings,
  Search,
  Smartphone,
  Trash2,
  Edit2,
  Share2,
  User,
  Key,
  Unlock,
  HelpCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { OTPAccount, ToastMessage, ModalType, AppSettings } from './types';
import { getRemainingSeconds, generateUUID } from './services/otpService';
import { deriveMasterKey, encryptData, decryptData } from './services/cryptoService';
import { api, SyncOperation, ApiError } from './services/api';
import { COLORS } from './constants/colors';
import { styles } from './constants/styles';

import { AboutModal } from './components/modals/AboutModal';

// Components
import { ToastContainer } from './components/ToastContainer';
import { OTPItem } from './components/OTPItem';
import { AccountFormModal } from './components/modals/AccountFormModal';
import { QRScannerModal } from './components/modals/QRScannerModal';
import { ExportQRModal } from './components/modals/ExportQRModal';
import { SettingsModal } from './components/modals/SettingsModal';

// Helper to parse JWT payload
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default function App() {
  const [accounts, setAccounts] = useState<OTPAccount[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [searchQuery, setSearchQuery] = useState('');
  const [remainingTime, setRemainingTime] = useState(getRemainingSeconds());
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<OTPAccount | null>(null);
  const [loginPassword, setLoginPassword] = useState('');

  // Sync State (Non-persistent)
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    cloudSyncEnabled: false,
    syncServerUrl: '',
    syncUsername: '',
  });

  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load Settings
  useEffect(() => {
    (async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('rosa_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }

        const savedAccounts = await AsyncStorage.getItem('rosa_local_accounts');
        if (savedAccounts) {
          setAccounts(JSON.parse(savedAccounts));
        } else {
          // Default initial data: Empty for production/local-only flow as requested
          setAccounts([]);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, []);

  // Update unlock state based on settings
  useEffect(() => {
    if (!isInitializing) {
      if (!settings.cloudSyncEnabled) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    }
  }, [settings.cloudSyncEnabled, isInitializing]);

  // Persist settings
  useEffect(() => {
    if (!isInitializing) {
      AsyncStorage.setItem('rosa_settings', JSON.stringify(settings));
    }
  }, [settings, isInitializing]);

  // Persist accounts
  useEffect(() => {
    if (!isInitializing && !settings.cloudSyncEnabled && isUnlocked) {
      AsyncStorage.setItem('rosa_local_accounts', JSON.stringify(accounts));
    }
  }, [accounts, isUnlocked, settings.cloudSyncEnabled, isInitializing]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(getRemainingSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isInitializing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.lockIconContainer}>
          <Shield size={64} color={COLORS.rose500} />
        </View>
      </View>
    );
  }

  // Sync Function
  const performSync = async (key: CryptoKey, token: string, operationOverride?: SyncOperation, settingsOverride?: AppSettings) => {
    try {
      const currentSettings = settingsOverride || settings;

      // 1. Prepare Upsert Operations for ALL local accounts (if no specific op provided)
      let operations: SyncOperation[] = [];

      if (operationOverride) {
        operations = [operationOverride];
      } else {
        // Initial Full Sync: Upsert everything we have locally
        // NOTE: In a real robust sync, we might want to check diffs, but user said:
        // "application gets all data from asyncstorage, encrypt all them ... then send them 'upsert'"
        const upsertOps = await Promise.all(accounts.map(async (acc) => {
          const encryptedPayload = await encryptData(JSON.stringify(acc), key);
          return {
            op: 'upsert' as const,
            data: {
              id: acc.id,
              encrypted_data: encryptedPayload
            }
          };
        }));
        operations = upsertOps;
      }

      // 2. Call API
      const remoteRecords = await api.sync(currentSettings, token, operations);

      // 3. Decrypt Responses & Merging
      // User said: "sync endpoint always return all data in the cloud"
      // "then decodes the otp codes in plain into model we use and update data in async storage"

      const newAccounts: OTPAccount[] = [];
      for (const record of remoteRecords) {
        if (record.encrypted_data) {
          const decryptedJson = await decryptData(record.encrypted_data, key);
          if (decryptedJson) {
            newAccounts.push(JSON.parse(decryptedJson));
          }
        }
      }

      setAccounts(newAccounts); // Update State (Effects will persist to storage if logic allows, checking logic...)
      // NOTE: Our persistence effect checks `!settings.cloudSyncEnabled`. 
      // If Cloud Sync IS enabled, we do NOT persist to AsyncStorage directly via that effect?
      // User said: "update data in async storage. then we list the otp codes to user in UI"
      // Wait, if cloud sync is enabled, do we still store locally?
      // User Req 1: "local only stores auth codes in plain ... self hosted sync data as e2ee in self hosted cloud sync."
      // This implies in Sync mode, we might NOT rely on local plain text storage?
      // OR do we cache it locally encrypted? 
      // User said: "application gets all data from asyncstorage, encrypt all them..." -> this implies starting from local plain.
      // User said: "update data in async storage" -> So we DO store it locally.
      // BUT, checking my persistence effect:
      // `if (!isLoading && !settings.cloudSyncEnabled && isUnlocked)`
      // This disables local text save when sync is enabled. 
      // This adheres to "local only stores plain... self hosted store e2ee". 
      // So if Sync is ON, we might treat RAM as the only plain text source?
      // "we will always store cloud sync url and username ... but never use password or token"
      // If we don't store plain text locally when Sync is ON, then we are good.
      // BUT if the user goes offline, they lose data?
      // "local only stores auth codes in plain ... self hosted sync data as e2ee in self hosted cloud sync"
      // This strongly implies NO plain text local storage when Sync is ON.

    } catch (e) {
      console.error("Sync Failed", e);
      if (e instanceof ApiError && e.status === 401) {
        addToast("Session expired, please login again", "error");
        setIsUnlocked(false);
        setJwtToken(null);
        setMasterKey(null);
        setLoginPassword('');
      } else {
        addToast("Sync Failed", "error");
      }
    }
  };

  const handleUnlock = async (providedPassword?: string) => {
    const passwordToUse = providedPassword || loginPassword;

    if (!settings.cloudSyncEnabled) {
      // Local Mode: No password logic really, just "unlocked" by default or if we had a local pass (not implemented)
      // Current logic for local mode is it's always unlocked. 
      // This function is mainly called from the Locked View which only shows if CloudSync is Enabled.
      return false;
    }

    if (!passwordToUse) {
      addToast("Password required", "error");
      return false;
    }

    try {
      setIsLoading(true);
      // 1. Login
      const token = await api.login(settings, passwordToUse);

      // 2. Extract Salt
      const payload = parseJwt(token);
      if (!payload || !payload.salt) {
        throw new Error("Invalid Token: Missing salt");
      }

      // 3. Derive Key
      const key = await deriveMasterKey(passwordToUse, payload.salt);

      setJwtToken(token);
      setMasterKey(key);
      setIsUnlocked(true);
      addToast("Vault Unlocked", "success");

      // 4. Initial Sync
      await performSync(key, token);

      return true;
    } catch (e) {
      console.error(e);
      addToast("Unlock/Login Failed", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  const copyToClipboard = async (text: string, service: string) => {
    await Clipboard.setStringAsync(text);
    addToast(`${service} code copied!`);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const oldAccounts = accounts;
            setAccounts(prev => prev.filter(acc => acc.id !== id));
            addToast("Account removed", "info");
            setSelectedAccountId(null);

            if (settings.cloudSyncEnabled && jwtToken && masterKey) {
              try {
                await performSync(masterKey, jwtToken, {
                  op: 'delete',
                  data: { id }
                });
              } catch (e) {
                // Rollback if needed, or just alert?
                // For now, simple optimistic update
              }
            }
          }
        }
      ]
    );
  };

  const filteredAccounts = accounts.filter(acc =>
    acc.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.accountName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Locked View ---
  if (settings.cloudSyncEnabled && !isUnlocked) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.lockContainer}>
          <View style={styles.lockIconContainer}>
            <Shield size={40} color={COLORS.white} />
          </View>
          <Text style={styles.titleLarge}>OwnAuth</Text>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={styles.labelAccent}>VAULT LOCKED</Text>
            <Text style={styles.textSmall}>{settings.syncServerUrl}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <View style={styles.userInfoRow}>
                <User size={20} color={COLORS.slate500} />
                <Text style={styles.textBaseGray}>{settings.syncUsername}</Text>
              </View>

              <View style={styles.inputIconWrapper}>
                <Key size={20} color={COLORS.slate500} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 48 }]}
                  placeholder="Master Password"
                  placeholderTextColor={COLORS.slate500}
                  secureTextEntry
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => handleUnlock()}
            >
              <Unlock size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Unlock Vault</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerNote}>Master Password is used for E2EE decryption.</Text>
        </View>
        <ToastContainer toasts={toasts} />
      </View>
    );
  }

  // --- Main View ---

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.headerIcon}>
            <Shield size={24} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>OwnAuth</Text>
            <Text style={styles.headerSubtitle}>
              {settings.cloudSyncEnabled ? 'SELF-HOSTED SYNC' : 'LOCAL ONLY'}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setActiveModal(ModalType.ABOUT)}
          >
            <HelpCircle size={20} color={COLORS.slate400} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setActiveModal(ModalType.SETTINGS)}
          >
            <Settings size={20} color={COLORS.slate400} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.slate500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your accounts..."
          placeholderTextColor={COLORS.slate500}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredAccounts.map((account) => (
          <OTPItem
            key={account.id}
            account={account}
            remainingTime={remainingTime}
            onCopy={copyToClipboard}
            onLongPress={() => setSelectedAccountId(account.id)}
          />
        ))}
        {filteredAccounts.length === 0 && (
          <View style={styles.emptyState}>
            <Smartphone size={64} color={COLORS.slate700} />
            <Text style={styles.emptyText}>No accounts found</Text>
            <Text style={[styles.textSmall, { textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }]}>
              Tap the + button in the bottom right to add new OTP codes.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingAccount(null);
          setActiveModal(ModalType.ACCOUNT_FORM);
        }}
      >
        <Plus size={32} color={COLORS.white} />
      </TouchableOpacity>

      {/* Options Sheet (Custom Modal) */}
      <Modal
        visible={!!selectedAccountId}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAccountId(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedAccountId(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.actionSheet}>
                <View style={styles.sheetHandle} />

                <TouchableOpacity style={styles.actionButton} onPress={() => {
                  const acc = accounts.find(a => a.id === selectedAccountId);
                  if (acc) {
                    setEditingAccount(acc);
                    setActiveModal(ModalType.EXPORT_QR);
                  }
                  setSelectedAccountId(null);
                }}>
                  <Share2 size={20} color={COLORS.emerald400} />
                  <Text style={styles.actionText}>Export Account (QR)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => {
                  const acc = accounts.find(a => a.id === selectedAccountId);
                  if (acc) {
                    setEditingAccount(acc);
                    setActiveModal(ModalType.ACCOUNT_FORM);
                  }
                  setSelectedAccountId(null);
                }}>
                  <Edit2 size={20} color={COLORS.rose400} />
                  <Text style={styles.actionText}>Edit Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => {
                  if (selectedAccountId) handleDelete(selectedAccountId);
                }}>
                  <Trash2 size={20} color={COLORS.rose500} />
                  <Text style={[styles.actionText, { color: COLORS.rose500 }]}>Delete Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setSelectedAccountId(null)}
                >
                  <Text style={[styles.actionText, { color: COLORS.slate300 }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* OTHER MODALS */}
      <AccountFormModal
        visible={activeModal === ModalType.ACCOUNT_FORM}
        onClose={() => {
          setActiveModal(ModalType.NONE);
          setEditingAccount(null);
        }}
        initialData={editingAccount}
        onAdd={async (newAcc: Partial<OTPAccount>) => {
          let updatedAccounts = [...accounts];
          let accountToSync: OTPAccount;

          if (editingAccount && editingAccount.id !== 'temp') {
            // Edit
            updatedAccounts = accounts.map(a => a.id === editingAccount.id ? { ...newAcc, id: editingAccount.id } : a) as OTPAccount[];
            accountToSync = updatedAccounts.find(a => a.id === editingAccount.id)!;
            addToast(`${newAcc.serviceName} updated!`);
          } else {
            // Add
            const newId = generateUUID();
            accountToSync = { ...newAcc, id: newId } as OTPAccount;
            updatedAccounts = [...accounts, accountToSync];
            addToast(`${newAcc.serviceName} added!`);
          }

          setAccounts(updatedAccounts);

          // Sync
          if (settings.cloudSyncEnabled && jwtToken && masterKey) {
            const encryptedPayload = await encryptData(JSON.stringify(accountToSync), masterKey);
            await performSync(masterKey, jwtToken, {
              op: 'upsert',
              data: {
                id: accountToSync.id,
                encrypted_data: encryptedPayload
              }
            });
          }
        }}
        onOpenScanner={() => setActiveModal(ModalType.QR_SCANNER)}
      />

      <QRScannerModal
        visible={activeModal === ModalType.QR_SCANNER}
        onClose={() => setActiveModal(ModalType.ACCOUNT_FORM)}
        onScan={(data: string) => {
          try {
            const url = new URL(data);
            if (url.protocol === 'otpauth:') {
              const secret = url.searchParams.get('secret');
              const issuer = url.searchParams.get('issuer') || url.pathname.split('/')[2]?.split(':')[0];
              const label = url.pathname.split('/')[2]?.split(':')[1] || url.pathname.split('/')[2];

              if (secret) {
                setEditingAccount({
                  id: 'temp',
                  serviceName: decodeURIComponent(issuer || ''),
                  accountName: decodeURIComponent(label || ''),
                  secretKey: secret.toUpperCase()
                });
                setActiveModal(ModalType.ACCOUNT_FORM);
                addToast("QR Code Scanned!");
              }
            }
          } catch (e) {
            addToast("Invalid QR Code", "error");
          }
        }}
      />

      <ExportQRModal
        visible={activeModal === ModalType.EXPORT_QR}
        onClose={() => setActiveModal(ModalType.NONE)}
        account={editingAccount}
      />

      <SettingsModal
        visible={activeModal === ModalType.SETTINGS}
        onClose={() => setActiveModal(ModalType.NONE)}
        settings={settings}
        onUpdateSettings={setSettings}
        onVerifyAndEnable={async (pwd: string, newSettings?: AppSettings) => {
          // Use provided new settings (from local modal state) or fall back to current
          const useSettings = newSettings || settings;

          const cleanUrl = useSettings.syncServerUrl.trim().replace(/\/+$/, '');
          const tempSettings = { ...useSettings, syncServerUrl: cleanUrl, cloudSyncEnabled: true };
          try {
            // 1. Verify Login manually using temp settings
            setIsLoading(true);
            const token = await api.login(tempSettings, pwd);
            const payload = parseJwt(token);
            if (!payload?.salt) throw new Error("No salt");
            const key = await deriveMasterKey(pwd, payload.salt);

            if (settings.cloudSyncEnabled) {
              // SWITCHING ACCOUNT:
              // 1. Wipe local data immediately to prevent leaks
              setAccounts([]);

              // 2. Perform a "Clean Sync" (Download Only)
              const remoteRecords = await api.sync(tempSettings, token, []);

              // 3. Decrypt & Populate New Data
              const newAccounts: OTPAccount[] = [];
              for (const record of remoteRecords) {
                if (record.encrypted_data) {
                  const decryptedJson = await decryptData(record.encrypted_data, key);
                  if (decryptedJson) {
                    newAccounts.push(JSON.parse(decryptedJson));
                  }
                }
              }
              setAccounts(newAccounts);
              addToast("Switched Account", "success");

              // 4. Update Settings but LOCK VAULT
              setSettings(prev => ({ ...prev, cloudSyncEnabled: true, syncServerUrl: cleanUrl, syncUsername: useSettings.syncUsername }));
              setJwtToken(null);
              setMasterKey(null);
              setLoginPassword(''); // Clear password
              setIsUnlocked(false); // Force Login Flow
              setActiveModal(ModalType.NONE); // Close Settings
              return true;
            }

            // If successful (FIRST ENABLE):
            setSettings(prev => ({ ...prev, cloudSyncEnabled: true, syncServerUrl: cleanUrl, syncUsername: useSettings.syncUsername }));
            setJwtToken(token);
            setMasterKey(key);
            setIsUnlocked(true);

            // Sync Initial Local Data to Cloud
            if (!settings.cloudSyncEnabled) {
              await performSync(key, token, undefined, tempSettings);
              addToast("Sync Enabled", "success");
            }

            setActiveModal(ModalType.NONE); // Close Settings
            return true;
          } catch (e) {
            console.error(e);
            addToast("Invalid Credentials / Sync Failed", "error");
            return false;
          } finally {
            setIsLoading(false);
          }
        }}
        onLogout={() => {
          if (settings.cloudSyncEnabled) {
            setIsUnlocked(false);
            setLoginPassword('');
            setActiveModal(ModalType.NONE);
            addToast("Vault Locked", "info");
          }
        }}
        onDisableSync={() => {
          // Reset everything
          setSettings(prev => ({
            ...prev,
            cloudSyncEnabled: false,
          }));
          setIsUnlocked(true);
          setLoginPassword('');
          setJwtToken(null);
          setMasterKey(null);

          addToast("Sync Disabled", "info");
        }}
      />

      <AboutModal
        visible={activeModal === ModalType.ABOUT}
        onClose={() => setActiveModal(ModalType.NONE)}
      />

      <ToastContainer toasts={toasts} />
    </View>
  );
}
