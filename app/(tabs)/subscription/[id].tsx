import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import api from '../../../src/services/api';
import { Subscription } from '../../../src/types';
import { theme } from '../../../src/theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import StyledButton from '../../../src/components/StyledButton';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchSubscription = async (): Promise<Subscription> => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data.data;
  };

  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Subscription>({
    queryKey: ['subscription', id],
    queryFn: fetchSubscription,
    enabled: !!id
  });

  // Mutation para deletar a assinatura
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/subscriptions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      Alert.alert('Sucesso', 'Assinatura deletada com sucesso!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao deletar assinatura');
    }
  });

  // Calcular dias até o vencimento
  const daysUntilRenewal = useMemo(() => {
    if (!subscription) return 0;

    const today = new Date();
    const renewalDate = new Date(subscription.renewal_date);
    const diffTime = renewalDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [subscription]);

  useEffect(() => {
    if (isError && error) {
      Alert.alert('Erro', error.message);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (isError || !subscription) {
    return (
      <View style={styles.centerContainer}>
        <Text>Erro ao carregar detalhes da assinatura</Text>
      </View>
    );
  }

  // Determinar status e cores
  let statusColor = theme.colors.primary; // Padrão: verde (bom)
  let statusText = 'Ativo';

  if (daysUntilRenewal < 0) {
    statusColor = theme.colors.danger; // Vermelho (vencido)
    statusText = 'Vencido';
  } else if (daysUntilRenewal <= 3) {
    statusColor = theme.colors.danger; // Vermelho (vencimento iminente)
    statusText = 'Vence em breve';
  } else if (daysUntilRenewal <= 7) {
    statusColor = theme.colors.warning; // Amarelo (próximo de vencer)
    statusText = 'Próximo de vencer';
  }

  // Formatar data
  const formattedDate = new Date(subscription.renewal_date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar esta assinatura? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          style: 'destructive',
          onPress: () => deleteMutation.mutate()
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
          <Text style={styles.serviceName}>{subscription.service.name}</Text>
          <Text style={styles.price}>R$ {parseFloat(subscription.price).toFixed(2)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialIcons name="event" size={20} color={theme.colors.text} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Próximo Vencimento</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialIcons name="schedule" size={20} color={theme.colors.text} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Dias até o vencimento</Text>
              <Text style={[styles.detailValue, { color: statusColor }]}>
                {daysUntilRenewal > 0 ? `${daysUntilRenewal} dias` : daysUntilRenewal === 0 ? 'Hoje' : 'Vencido'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialIcons name="repeat" size={20} color={theme.colors.text} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Frequência de Cobrança</Text>
              <Text style={styles.detailValue}>Mensal</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialIcons name="notifications" size={20} color={theme.colors.text} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Notificação</Text>
              <Text style={styles.detailValue}>7 dias antes</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <StyledButton
            title="Editar Assinatura"
            onPress={() => router.push(`/(tabs)/editSubscription?id=${subscription.id}`)}
            isLoading={false}
          />
          <StyledButton
            title="Deletar Assinatura"
            onPress={handleDelete}
            isLoading={deleteMutation.isPending}
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
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.l,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
    marginBottom: theme.spacing.m,
  },
  statusText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: 'bold' as 'bold',
  },
  serviceName: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold' as 'bold',
    color: theme.colors.primary,
  },
  detailsContainer: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: theme.typography.subtitle.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    color: theme.colors.text,
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
});