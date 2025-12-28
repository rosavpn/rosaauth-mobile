import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import { X, AlertCircle } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import { styles } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

export function QRScannerModal({
  visible,
  onClose,
  onScan,
}: {
  visible: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}) {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible && !permission) {
      requestPermission();
    }
  }, [visible, permission]);

  if (!visible) return null;

  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="fade">
        <View style={[styles.container, styles.centerContent]}>
          <AlertCircle size={48} color={COLORS.rose500} style={{ marginBottom: 20 }} />
          <Text style={[styles.textBaseBold, { marginBottom: 8, textAlign: 'center' }]}>
            {t('permissions.cameraRequiredTitle')}
          </Text>
          <Text
            style={[styles.textSmall, { marginBottom: 32, textAlign: 'center', maxWidth: 300 }]}
          >
            {t('permissions.cameraRequiredBody')}
          </Text>

          <View style={{ width: '100%', gap: 16 }}>
            <TouchableOpacity
              onPress={() => {
                if (permission && !permission.canAskAgain) {
                  Linking.openSettings();
                } else {
                  requestPermission();
                }
              }}
              style={styles.buttonPrimary}
            >
              <Text style={styles.buttonText}>
                {permission?.canAskAgain === false
                  ? t('permissions.openSettings')
                  : t('permissions.grantPermission')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.buttonPrimary, { backgroundColor: COLORS.slate800 }]}
            >
              <Text style={[styles.buttonText, { color: COLORS.slate300 }]}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={({ data }) => onScan(data)}
        />

        <View style={styles.cameraOverlay}>
          <View style={styles.cameraHeader}>
            <Text style={styles.cameraTitle}>{t('forms.scanQrCode')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.cameraFrame} />
        </View>
      </View>
    </Modal>
  );
}
