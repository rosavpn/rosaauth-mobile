import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import { X, Github, ExternalLink } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

export function AboutModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  if (!visible) return null;

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={[styles.modalHeader, { padding: 20 }]}>
          <Text style={styles.modalTitle}>{t('modals.aboutTitle')}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={COLORS.slate300} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              source={require('../../assets/icon.png')}
              style={{ width: 80, height: 80, marginBottom: 16, borderRadius: 20 }}
              resizeMode="contain"
            />
            <Text style={styles.textBaseBold}>OwnAuth</Text>
            <Text style={styles.textSmall}>{t('modals.aboutSubtitle')}</Text>
          </View>

          <Text
            style={[styles.textBase, { marginBottom: 24, lineHeight: 24, color: COLORS.slate400 }]}
          >
            {t('modals.aboutDescription')}
          </Text>

          <Text style={styles.label}>{t('modals.sourceCode')}</Text>

          <TouchableOpacity
            style={[styles.actionButton, { marginBottom: 16 }]}
            onPress={() => openLink('https://github.com/rosavpn/rosaauth-mobile')}
          >
            <Github size={20} color={COLORS.slate300} />
            <View style={{ flex: 1 }}>
              <Text style={styles.textBase}>{t('modals.mobileApp')}</Text>
              <Text style={[styles.textSmall, { fontSize: 12 }]}>
                github.com/rosavpn/rosaauth-mobile
              </Text>
            </View>
            <ExternalLink size={16} color={COLORS.slate500} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openLink('https://github.com/rosavpn/rosaauth-server')}
          >
            <Github size={20} color={COLORS.slate300} />
            <View style={{ flex: 1 }}>
              <Text style={styles.textBase}>{t('modals.syncServer')}</Text>
              <Text style={[styles.textSmall, { fontSize: 12 }]}>
                github.com/rosavpn/rosaauth-server
              </Text>
            </View>
            <ExternalLink size={16} color={COLORS.slate500} />
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{t('modals.licenseInfo')}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
