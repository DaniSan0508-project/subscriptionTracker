import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import StyledInput from '../../src/components/StyledInput';
import StyledButton from '../../src/components/StyledButton';

export default function AddSubscriptionScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [service_id, setServiceId] = useState('1');
  const [price, setPrice] = useState('');
  const [renewal_date, setRenewalDate] = useState('2025-12-31');
  const [renewal_period_value, setRenewalPeriodValue] = useState('1');
  const [renewal_period_unit, setRenewalPeriodUnit] = useState('month');
  const [notify_before_value, setNotifyBeforeValue] = useState('7');
  const [notify_before_unit, setNotifyBeforeUnit] = useState('day');
  
  const createSubscription = async (newData: any) => {
    const response = await api.post('/subscriptions', newData);
    return response.data;
  };
  
  const mutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      Alert.alert('Sucesso', 'Assinatura criada!');
      router.back();
    },
  });
  
  const handleSubmit = () => {
    const newData = {
      service_id: parseInt(service_id),
      price,
      renewal_date,
      renewal_period_value: parseInt(renewal_period_value),
      renewal_period_unit,
      notify_before_value: parseInt(notify_before_value),
      notify_before_unit,
    };
    
    mutation.mutate(newData);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Assinatura</Text>
      
      <StyledInput
        value={service_id}
        onChangeText={setServiceId}
        placeholder="ID do Serviço"
        keyboardType="numeric"
      />
      
      <StyledInput
        value={price}
        onChangeText={setPrice}
        placeholder="Preço (ex: 29.90)"
        keyboardType="decimal-pad"
      />
      
      <StyledInput
        value={renewal_date}
        onChangeText={setRenewalDate}
        placeholder="Data de Renovação (ex: 2025-12-31)"
      />
      
      <StyledInput
        value={renewal_period_value}
        onChangeText={setRenewalPeriodValue}
        placeholder="Período de Renovação (número)"
        keyboardType="numeric"
      />
      
      <StyledInput
        value={renewal_period_unit}
        onChangeText={setRenewalPeriodUnit}
        placeholder="Unidade de Período (ex: month, year)"
      />
      
      <StyledInput
        value={notify_before_value}
        onChangeText={setNotifyBeforeValue}
        placeholder="Notificar Antes (número)"
        keyboardType="numeric"
      />
      
      <StyledInput
        value={notify_before_unit}
        onChangeText={setNotifyBeforeUnit}
        placeholder="Unidade de Notificação (ex: day, week)"
      />
      
      <StyledButton
        title="Salvar Assinatura"
        onPress={handleSubmit}
        isLoading={mutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});