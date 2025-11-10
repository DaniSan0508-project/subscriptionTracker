import { useAuth } from '../../src/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import api from '../../src/services/api';
import { User } from '../../src/types';
import StyledButton from '../../src/components/StyledButton';
import { theme } from '../../src/theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const { signOut } = useAuth();

    const fetchUser = async (): Promise<User> => {
        const response = await api.get('/user');
        return response.data.data; // O backend Laravel Sanctum retorna os dados dentro de 'data'
    };

    // Mutation para logout
    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post('/logout');
            return response.data;
        },
        onSuccess: () => {
            signOut(); // Limpa o token local após logout bem-sucedido
        },
        onError: (error: any) => {
            console.error('Erro no logout:', error);
            signOut(); // Mesmo em caso de erro, limpa o token local
        }
    });

    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['user'],
        queryFn: fetchUser
    });

    const handleLogout = async () => {
        logoutMutation.mutate();
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.contentWrapper}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <MaterialIcons name="person" size={48} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                </View>

                <View style={styles.section}>
                    <View style={[styles.optionItem, styles.optionItemLast]}>
                        <MaterialIcons name="notifications" size={24} color={theme.colors.text} />
                        <Text style={styles.optionText}>Notificações</Text>
                    </View>
                    <View style={[styles.optionItem, styles.optionItemLast]}>
                        <MaterialIcons name="settings" size={24} color={theme.colors.text} />
                        <Text style={styles.optionText}>Configurações</Text>
                    </View>
                    <View style={[styles.optionItem, styles.optionItemLast]}>
                        <MaterialIcons name="help" size={24} color={theme.colors.text} />
                        <Text style={styles.optionText}>Ajuda</Text>
                    </View>
                </View>

                <View style={styles.logoutSection}>
                    <StyledButton
                        title="Sair"
                        onPress={handleLogout}
                        isLoading={logoutMutation.isPending}
                        style={{ backgroundColor: theme.colors.danger }}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    contentWrapper: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    profileHeader: {
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    userName: {
        fontSize: theme.typography.title.fontSize,
        fontWeight: theme.typography.title.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    userEmail: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
    },
    section: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderRadius: theme.components.card.borderRadius,
        padding: theme.spacing.m,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    optionItemLast: {
        borderBottomWidth: 0,
    },
    optionText: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
        marginLeft: theme.spacing.m,
    },
    logoutSection: {
        marginHorizontal: theme.spacing.m,
        marginTop: 0,
        marginBottom: theme.spacing.m,
    },
});