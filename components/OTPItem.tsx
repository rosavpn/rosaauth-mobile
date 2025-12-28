import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import { OTPAccount } from '../types';
import { generateTOTPCode } from '../services/otpService';
import { styles } from '../constants/styles';
import { COLORS } from '../constants/colors';

export function OTPItem({ account, remainingTime, onCopy, onLongPress }: { account: OTPAccount, remainingTime: number, onCopy: (c: string, s: string) => void, onLongPress: () => void }) {
    const code = generateTOTPCode(account.secretKey);
    const isExpiring = remainingTime <= 5;

    // Progress Animation
    const progressAnim = useRef(new Animated.Value((remainingTime / 30) * 100)).current;

    // Blinking Animation for Text Color
    const blinkAnim = useRef(new Animated.Value(0)).current;

    // Single smooth animation loop dependent on the code cycle
    useEffect(() => {
        // Calculates precise initial value based on date
        const now = Date.now() / 1000;
        const period = 30;
        const remaining = period - (now % period);
        progressAnim.setValue((remaining / period) * 100);

        Animated.timing(progressAnim, {
            toValue: 0,
            duration: remaining * 1000,
            easing: Easing.linear,
            useNativeDriver: false
        }).start();
    }, [code]); // Reset on code change (every 30s)

    // Blink Effect
    useEffect(() => {
        if (isExpiring) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(blinkAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false
                    }),
                    Animated.timing(blinkAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: false
                    })
                ])
            ).start();
        } else {
            blinkAnim.setValue(0);
            blinkAnim.stopAnimation();
        }
    }, [isExpiring]);

    // Interpolate color
    const textColor = blinkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.rose400, COLORS.rose600]
    });

    const progressColor = blinkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.rose600, COLORS.rose500]
    });


    return (
        <TouchableOpacity
            style={styles.otpCard}
            onLongPress={() => {
                Vibration.vibrate(50);
                onLongPress();
            }}
            onPress={() => onCopy(code, account.serviceName)}
            activeOpacity={0.7}
        >
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.otpService}>{account.serviceName}</Text>
                <Text style={styles.otpAccount} numberOfLines={1}>{account.accountName}</Text>
            </View>
            <View>
                <Animated.Text style={[styles.otpCode, { color: isExpiring ? textColor : COLORS.rose400 }]}>
                    {code.slice(0, 3)} {code.slice(3)}
                </Animated.Text>
            </View>
            {/* Progress Bar */}
            <View style={styles.progressTrack}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%']
                            }),
                            backgroundColor: isExpiring ? progressColor : COLORS.rose600
                        }
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
}
