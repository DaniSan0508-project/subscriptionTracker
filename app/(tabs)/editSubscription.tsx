import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../src/services/api';
import StyledInput from '../../src/components/StyledInput';
import StyledButton from '../../src/components/StyledButton';
import { theme } from '../../src/theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Subscription } from '../../src/types';

export default function EditSubscriptionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [renewalPeriodValue, setRenewalPeriodValue] = useState('1');
  const [renewalPeriodUnit, setRenewalPeriodUnit] = useState('month');
  const [notifyBeforeValue, setNotifyBeforeValue] = useState('7');
  const [notifyBeforeUnit, setNotifyBeforeUnit] = useState('day');

  // Buscar dados da assinatura existente
  const {
    data: subscription,
    isLoading,
    isError
  } = useQuery<Subscription>({
    queryKey: ['subscription', id],
    queryFn: async () => {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data.data;
    },
    enabled: !!id
  });

  // Inicializar os campos com os dados existentes
  useEffect(() => {
    if (subscription) {
      setServiceName(subscription.service.name);
      setPrice(subscription.price);
      setRenewalDate(subscription.renewal_date);
      // Aqui estamos assumindo que os dados de período e notificação estarão disponíveis
      // mas pode ser que o backend precise retornar essas informações também
    }
  }, [subscription]);

  // Mutation para atualizar a assinatura
  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await api.put(`/subscriptions/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      Alert.alert('Sucesso', 'Assinatura atualizada com sucesso!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao atualizar assinatura');
    }
  });

  const handleUpdate = () => {
    // Validação básica
    if (!serviceName || !price || !renewalDate) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const updatedData = {
      service: { name: serviceName },
      price,
      renewal_date: renewalDate,
      renewal_period_value: parseInt(renewalPeriodValue),
      renewal_period_unit: renewalPeriodUnit,
      notify_before_value: parseInt(notifyBeforeValue),
      notify_before_unit: notifyBeforeUnit,
    };

    updateMutation.mutate(updatedData);
  };

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
        <Text>Erro ao carregar dados da assinatura</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Editar Assinatura</Text>
        </View>

        <View style={styles.form}>
          <StyledInput
            value={serviceName}
            onChangeText={setServiceName}
            placeholder="Nome do serviço (ex: Netflix)"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <StyledInput
            value={price}
            onChangeText={setPrice}
            placeholder="Preço (ex: 29.90)"
            keyboardType="decimal-pad"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <StyledInput
            value={renewalDate}
            onChangeText={setRenewalDate}
            placeholder="Data de Renovação (AAAA-MM-DD)"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <StyledInput
                value={renewalPeriodValue}
                onChangeText={setRenewalPeriodValue}
                placeholder="Período"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.halfInput}>
              <StyledInput
                value={renewalPeriodUnit}
                onChangeText={setRenewalPeriodUnit}
                placeholder="Unidade (ex: month)"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <StyledInput
                value={notifyBeforeValue}
                onChangeText={setNotifyBeforeValue}
                placeholder="Notificar antes"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.halfInput}>
              <StyledInput
                value={notifyBeforeUnit}
                onChangeText={setNotifyBeforeUnit}
                placeholder="Unidade notif. (ex: day)"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <StyledButton
            title="Atualizar Assinatura"
            onPress={handleUpdate}
            isLoading={updateMutation.isPending}
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
    padding: theme.spacing.m,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.s,
  },
  title: {
    fontSize: theme.typography.headline.fontSize,
    fontWeight: theme.typography.headline.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.components.card.borderRadius,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.s,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
});