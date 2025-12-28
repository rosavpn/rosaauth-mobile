import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { X, QrCode } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { OTPAccount } from '../../types';
import { styles } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

export function AccountFormModal({
  visible,
  onClose,
  onAdd,
  onOpenScanner,
  initialData,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (acc: Partial<OTPAccount>) => void;
  onOpenScanner: () => void;
  initialData: OTPAccount | null;
}) {
  const { t } = useTranslation();
  const [service, setService] = useState('');
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    if (visible && initialData) {
      setService(initialData.serviceName);
      setEmail(initialData.accountName);
      setSecret(initialData.secretKey);
    } else if (visible) {
      setService('');
      setEmail('');
      setSecret('');
    }
  }, [visible, initialData]);

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialData && initialData.id !== 'temp'
                ? t('accounts.editAccount')
                : t('accounts.addAccount')}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={COLORS.slate300} />
            </TouchableOpacity>
          </View>

          {(!initialData || initialData.id === 'temp') && (
            <TouchableOpacity style={styles.scanButton} onPress={onOpenScanner}>
              <QrCode size={20} color={COLORS.rose400} />
              <Text style={styles.scanButtonText}>{t('forms.scanQrCode')}</Text>
            </TouchableOpacity>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('forms.service')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('forms.servicePlaceholder')}
                placeholderTextColor={COLORS.slate500}
                value={service}
                onChangeText={setService}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('forms.usernameEmail')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('forms.usernamePlaceholder')}
                placeholderTextColor={COLORS.slate500}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('forms.secretKey')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('forms.secretPlaceholder')}
                placeholderTextColor={COLORS.slate500}
                value={secret}
                onChangeText={setSecret}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 20 }]}
              onPress={() => {
                if (service && secret) {
                  onAdd({
                    serviceName: service,
                    accountName: email,
                    secretKey: secret.toUpperCase(),
                  });
                  onClose();
                }
              }}
            >
              <Text style={styles.buttonText}>
                {initialData && initialData.id !== 'temp'
                  ? t('common.save')
                  : t('accounts.addAccount')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
