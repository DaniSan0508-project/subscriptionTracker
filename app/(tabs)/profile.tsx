import { useAuth } from '../../src/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../../src/services/api';
import { User } from '../../src/types';
import StyledButton from '../../src/components/StyledButton';
import { theme } from '../../src/theme/theme';

export default function ProfileScreen() {
    const { signOut } = useAuth();

    const fetchUser = async (): Promise<User> => {
        const response = await api.get('/user');
        return response.data;
    };

    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['user'],
        queryFn: fetchUser
    });

    const handleLogout = async () => {
        await signOut();
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {user && (
                <>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </>
            )}
            <StyledButton
                title="Sair"
                onPress={handleLogout}
                isLoading={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.m,
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: theme.typography.title.fontSize,
        fontWeight: theme.typography.title.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
        textAlign: 'center',
        marginBottom: theme.spacing.s,
    },
    userEmail: {
        fontSize: theme.typography.caption.fontSize,
        fontWeight: theme.typography.caption.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        color: theme.colors.gray,
    },
});