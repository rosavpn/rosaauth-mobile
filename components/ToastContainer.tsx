import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle, Check } from 'lucide-react-native';
import { ToastMessage } from '../types';
import { styles } from '../constants/styles';
import { COLORS } from '../constants/colors';

export function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
    if (toasts.length === 0) return null;
    return (
        <View style={styles.toastContainer} pointerEvents="none">
            {toasts.map(toast => (
                <View key={toast.id} style={styles.toast}>
                    <View style={[styles.toastIcon, { backgroundColor: toast.type === 'error' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(34, 197, 94, 0.2)' }]}>
                        {toast.type === 'error' ? <AlertCircle size={16} color={COLORS.rose500} /> : <Check size={16} color={COLORS.green500} />}
                    </View>
                    <Text style={styles.toastText}>{toast.message}</Text>
                </View>
            ))}
        </View>
    );
}
