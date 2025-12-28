import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { X, Shield, RefreshCw, Cloud, Info } from 'lucide-react-native';
import { AppSettings } from '../../types';
import { styles } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

export function SettingsModal({
  visible,
  onClose,
  settings,
  onVerifyAndEnable,
}: {
  visible: boolean;
  onClose: () => void;
  settings: AppSettings;
  onVerifyAndEnable: (pwd: string, newSettings?: AppSettings) => Promise<boolean>;
}) {
  const [tempPwd, setTempPwd] = useState('');
  const [localUrl, setLocalUrl] = useState(settings.syncServerUrl);
  const [localUsername, setLocalUsername] = useState(settings.syncUsername);

  // Reset local state when modal opens/closes or settings change externally
  React.useEffect(() => {
    if (visible) {
      setLocalUrl(settings.syncServerUrl);
      setLocalUsername(settings.syncUsername);
      setTempPwd('');
    }
  }, [visible, settings]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={[styles.modalHeader, { padding: 20 }]}>
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={COLORS.slate300} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Sync Section */}
          <View style={{ marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={styles.iconBox}>
                <Cloud size={24} color={COLORS.rose400} />
              </View>
              <View>
                <Text style={styles.textBaseBold}>Self-Hosted Sync</Text>
                <Text style={styles.textSmall}>End-to-end encrypted storage</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>SERVER URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://subdomain.yourdomain.tld"
                placeholderTextColor={COLORS.slate500}
                value={localUrl}
                onChangeText={setLocalUrl}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="user@example.com"
                placeholderTextColor={COLORS.slate500}
                value={localUsername}
                onChangeText={setLocalUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>MASTER PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.slate500}
                secureTextEntry
                value={tempPwd}
                onChangeText={setTempPwd}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.buttonPrimary,
                {
                  marginTop: 24,
                  backgroundColor: settings.cloudSyncEnabled ? COLORS.amber600 : COLORS.rose600,
                },
              ]}
              onPress={() => {
                const newSettings = {
                  ...settings,
                  syncServerUrl: localUrl,
                  syncUsername: localUsername,
                };
                if (settings.cloudSyncEnabled) {
                  Alert.alert(
                    'Switch Account & Wipe Data',
                    'Warning: Switching accounts will DELETE ALL LOCAL OTP CODES to prevent data leaks between accounts.\n\nThis action cannot be undone.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete & Switch',
                        style: 'destructive',
                        onPress: () => {
                          if (tempPwd) onVerifyAndEnable(tempPwd, newSettings);
                        },
                      },
                    ],
                  );
                } else {
                  if (tempPwd) onVerifyAndEnable(tempPwd, newSettings);
                }
              }}
            >
              {settings.cloudSyncEnabled ? (
                <RefreshCw size={20} color={COLORS.white} />
              ) : (
                <Shield size={20} color={COLORS.white} />
              )}
              <Text style={styles.buttonText}>
                {settings.cloudSyncEnabled ? 'Switch Account' : 'Enable & Sync'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Info size={20} color={COLORS.slate500} />
            <Text style={styles.infoText}>
              OwnAuth - Your data is encrypted locally using AES before sync. Master password is
              required to initiate the first connection.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
