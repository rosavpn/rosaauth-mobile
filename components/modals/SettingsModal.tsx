import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { X, Shield, RefreshCw, Cloud, Info } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <Text style={styles.modalTitle}>{t('modals.settingsTitle')}</Text>
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
                <Text style={styles.textBaseBold}>{t('sync.selfHostedSyncTitle')}</Text>
                <Text style={styles.textSmall}>{t('sync.e2eeStorage')}</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('sync.serverUrl')}</Text>
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
              <Text style={styles.label}>{t('sync.username')}</Text>
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
              <Text style={styles.label}>{t('auth.masterPassword')}</Text>
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
                  Alert.alert(t('sync.switchAccountAlertTitle'), t('sync.switchAccountAlertBody'), [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                      text: t('sync.deleteAndSwitch'),
                      style: 'destructive',
                      onPress: () => {
                        if (tempPwd) onVerifyAndEnable(tempPwd, newSettings);
                      },
                    },
                  ]);
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
                {settings.cloudSyncEnabled ? t('sync.switchAccount') : t('sync.enableAndSync')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Info size={20} color={COLORS.slate500} />
            <Text style={styles.infoText}>{t('sync.infoBox')}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
