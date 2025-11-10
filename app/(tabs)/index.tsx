import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import FloatingActionButton from '../../src/components/FloatingActionButton';
import SubscriptionCard from '../../src/components/SubscriptionCard';
import api from '../../src/services/api';
import { theme } from '../../src/theme/theme';
import { Subscription } from '../../src/types';

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
            return sum + parseFloat(sub.price);
        }, 0);
    }, [subscriptions]);

    const expiringSoonCount = useMemo(() => {
        if (!subscriptions) return 0;

        const today = new Date();
        return subscriptions.filter(sub => {
            const renewalDate = new Date(sub.renewal_date);
            const diffTime = renewalDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0; // Próximas de vencer em até 7 dias
        }).length;
    }, [subscriptions]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Erro: {error.message}</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Subscription }) => (
        <SubscriptionCard
            subscription={item}
            onPress={() => router.push(`/(tabs)/subscription/${item.id}`)}
        />
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Minhas Assinaturas</Text>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="receipt-long" size={24} color={theme.colors.primary} />
                    </View>
                </View>

                <View style={styles.summaryCards}>
                    <View style={[styles.summaryCard, styles.totalCard]}>
                        <View style={styles.summaryContent}>
                            <Text style={styles.summaryLabel}>Gasto Mensal</Text>
                            <Text style={styles.summaryValue}>
                                R$ {totalMonthly.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                        <View style={styles.iconBackground}>
                            <MaterialIcons name="payments" size={24} color={theme.colors.primary} />
                        </View>
                    </View>

                    <View style={[styles.summaryCard, styles.expiringCard]}>
                        <View style={styles.summaryContent}>
                            <Text style={styles.summaryLabel}>Próximas</Text>
                            <Text style={styles.summaryValue}>{expiringSoonCount}</Text>
                        </View>
                        <View style={[styles.iconBackground, styles.warningIcon]}>
                            <MaterialIcons name="notifications" size={24} color={theme.colors.warning} />
                        </View>
                    </View>
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={subscriptions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        onRefresh={refetch}
                        refreshing={isLoading}
                        style={styles.list}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={refetch}
                                colors={[theme.colors.primary]}
                            />
                        }
                        ListHeaderComponent={
                            <Text style={styles.sectionTitle}>Todas as Assinaturas</Text>
                        }
                    />
                </View>
            </ScrollView>

            <FloatingActionButton onPress={() => router.push('/(tabs)/addSubscription')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 100, // Espaço para o botão flutuante
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        paddingTop: 50, // Espaçamento extra para o status bar
        paddingBottom: theme.spacing.m,
    },
    title: {
        fontSize: theme.typography.headline.fontSize,
        fontWeight: theme.typography.headline.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
        color: theme.colors.text,
    },
    iconContainer: {
        padding: theme.spacing.s,
        backgroundColor: theme.colors.primaryLight,
        borderRadius: 12,
    },
    summaryCards: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    summaryCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.components.card.borderRadius,
        padding: theme.spacing.m,
        marginRight: theme.spacing.s,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    totalCard: {
        marginRight: theme.spacing.xs,
    },
    expiringCard: {
        marginLeft: theme.spacing.xs,
    },
    summaryContent: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold' as 'bold',
        color: theme.colors.text,
    },
    iconBackground: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningIcon: {
        backgroundColor: theme.colors.secondaryLight,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: theme.spacing.m,
    },
    list: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: theme.typography.subtitle.fontSize,
        fontWeight: theme.typography.subtitle.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
        color: theme.colors.text,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        backgroundColor: theme.colors.background,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: theme.typography.body.fontSize,
    },
});