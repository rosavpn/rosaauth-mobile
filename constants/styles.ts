import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.slate950,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    textBase: {
        color: COLORS.slate100,
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto'
    },
    textBaseGray: {
        color: COLORS.slate400,
        fontSize: 14,
        fontWeight: 'bold'
    },
    textBaseBold: {
        color: COLORS.slate100,
        fontSize: 18,
        fontWeight: 'bold'
    },
    textSmall: {
        color: COLORS.slate500,
        fontSize: 14,
    },
    textSmallCenter: {
        color: COLORS.slate400,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20
    },
    titleLarge: {
        fontSize: 40,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: -1,
        marginBottom: 4
    },
    labelAccent: {
        color: COLORS.rose400,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8
    },
    label: {
        color: COLORS.slate500,
        fontSize: 12,
        marginBottom: 8,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    input: {
        backgroundColor: COLORS.slate900,
        borderWidth: 1,
        borderColor: COLORS.slate800,
        borderRadius: 12,
        padding: 16,
        color: COLORS.white,
        fontSize: 16,
        width: '100%'
    },
    buttonPrimary: {
        backgroundColor: COLORS.rose600,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        width: '100%'
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16
    },
    lockContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        padding: 20
    },
    lockIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(225, 29, 72, 0.1)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(225, 29, 72, 0.2)'
    },
    card: {
        width: '100%',
        backgroundColor: COLORS.slate900,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.slate800,
        gap: 24
    },
    inputGroup: {
        gap: 16
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.slate950,
        padding: 16,
        borderRadius: 12
    },
    inputIconWrapper: {
        position: 'relative',
        justifyContent: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 10
    },
    footerNote: {
        color: COLORS.slate500,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 32
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: COLORS.slate950
    },
    headerIcon: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.rose600,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white
    },
    headerSubtitle: {
        fontSize: 10,
        color: COLORS.rose400,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    settingsButton: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.slate900,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.slate800
    },
    searchContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        position: 'relative'
    },
    searchIcon: {
        position: 'absolute',
        left: 16,
        top: 16,
        zIndex: 10
    },
    searchInput: {
        backgroundColor: COLORS.slate900,
        borderWidth: 1,
        borderColor: COLORS.slate800,
        borderRadius: 16,
        padding: 16,
        paddingLeft: 48,
        color: COLORS.white,
        fontSize: 16
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
        gap: 20
    },
    otpCard: {
        backgroundColor: COLORS.slate900,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.slate800,
        position: 'relative',
        overflow: 'hidden'
    },
    otpService: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 4
    },
    otpAccount: {
        color: COLORS.slate500,
        fontSize: 16,
        fontWeight: '500'
    },
    otpCode: {
        color: COLORS.rose400,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        letterSpacing: 4
    },
    progressTrack: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: COLORS.slate800
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.rose600
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        opacity: 0.5
    },
    emptyText: {
        color: COLORS.slate500,
        fontSize: 18,
        marginTop: 20
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.rose600,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.rose600,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        justifyContent: 'flex-end'
    },
    actionSheet: {
        backgroundColor: COLORS.slate900,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        gap: 16,
        paddingBottom: 40
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.slate700,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 10
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: COLORS.slate950,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.slate800
    },
    actionText: {
        color: COLORS.slate300,
        fontSize: 16,
        fontWeight: '500'
    },
    cancelButton: {
        marginTop: 8,
        backgroundColor: 'transparent',
        borderWidth: 0,
        justifyContent: 'center'
    },
    modalCard: {
        backgroundColor: COLORS.slate900,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 32,
        borderWidth: 1,
        borderColor: COLORS.slate800,
        maxHeight: '90%'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.slate800,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(251, 113, 133, 0.1)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(251, 113, 133, 0.2)',
        borderStyle: 'dashed'
    },
    scanButtonText: {
        color: COLORS.rose400,
        fontWeight: 'bold'
    },
    formGroup: {
        marginBottom: 20
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
        paddingTop: 60
    },
    cameraHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cameraTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold'
    },
    cameraFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: COLORS.rose500,
        borderRadius: 24,
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginBottom: 24
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(251, 113, 133, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 113, 133, 0.2)'
    },
    infoBox: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: COLORS.slate800,
        padding: 16,
        borderRadius: 16,
        marginTop: 40
    },
    infoText: {
        flex: 1,
        color: COLORS.slate400,
        fontSize: 12,
        lineHeight: 18
    },
    toastContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        gap: 8,
        zIndex: 100
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.slate900,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.slate800,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    },
    toastIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toastText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500'
    }
});
