import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import SvgQRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';
import { OTPAccount } from '../../types';
import { styles } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

export function ExportQRModal({
  visible,
  onClose,
  account,
}: {
  visible: boolean;
  onClose: () => void;
  account: OTPAccount | null;
}) {
  const { t } = useTranslation();

  if (!visible || !account) return null;
  const otpUrl = `otpauth://totp/${encodeURIComponent(account.serviceName)}:${encodeURIComponent(account.accountName)}?secret=${account.secretKey}&issuer=${encodeURIComponent(account.serviceName)}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{t('modals.exportQrTitle')}</Text>
              <Text style={styles.labelAccent}>{account.serviceName}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={COLORS.slate300} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <SvgQRCode value={otpUrl} size={200} backgroundColor="white" />
          </View>

          <Text style={styles.textSmallCenter}>{t('modals.exportQrBody')}</Text>
        </View>
      </View>
    </Modal>
  );
}
