import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import { Subscription } from '../../src/types';
import StyledButton from '../../src/components/StyledButton';
import { theme } from '../../src/theme/theme';

export default function DashboardScreen() {
    const router = useRouter();
    const fetchSubscriptions = async (): Promise<Subscription[]> => {
        const response = await api.get('/subscriptions');
        return response.data.data;
    };

    const {
        data: subscriptions,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<Subscription[]>({
        queryKey: ['subscriptions'],
        queryFn: fetchSubscriptions
    });

    const totalMonthly = useMemo(() => {
      if (!subscriptions) return 0;
      
      return subscriptions.reduce((sum, sub) => {
        // Converte o preço (string) para número antes de somar
        return sum + parseFloat(sub.price); 
      }, 0);
    }, [subscriptions]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.centerContainer}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Subscription }) => (
        <View style={styles.card}>
            <Text style={styles.serviceName}>{item.service.name}</Text>
            <Text style={styles.price}>R$ {item.price}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minhas Assinaturas</Text>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Gasto Mensal Total</Text>
              <Text style={styles.totalValue}>
                R$ {totalMonthly.toFixed(2).replace('.', ',')}
              </Text>
            </View>
            <StyledButton
                title="Adicionar Nova"
                onPress={() => router.push('/(tabs)/addSubscription')}
                isLoading={false}
            />
            <FlatList
                data={subscriptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onRefresh={refetch}
                refreshing={isLoading}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.m,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: theme.typography.title.fontSize,
        fontWeight: theme.typography.title.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
        marginBottom: theme.spacing.m,
        textAlign: 'center',
    },
    list: {
        flex: 1,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        marginVertical: theme.spacing.s,
        marginHorizontal: theme.spacing.m,
        borderRadius: theme.components.button.borderRadius,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    serviceName: {
        fontSize: theme.typography.subtitle.fontSize,
        fontWeight: theme.typography.subtitle.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    },
    price: {
        fontSize: theme.typography.caption.fontSize,
        fontWeight: theme.typography.caption.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
        marginTop: theme.spacing.s,
    },
    totalCard: {
      backgroundColor: theme.colors.primary, // Destaque com a cor primária
      padding: theme.spacing.l,
      borderRadius: theme.components.button.borderRadius,
      marginBottom: theme.spacing.m,
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.white,
      marginBottom: theme.spacing.s,
    },
    totalValue: {
      fontSize: 32, // Destaque
      fontWeight: 'bold',
      color: theme.colors.white,
    },
});
