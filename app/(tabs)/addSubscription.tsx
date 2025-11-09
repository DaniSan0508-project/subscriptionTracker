import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../src/components/StyledButton';
import StyledInput from '../../src/components/StyledInput';
import api from '../../src/services/api';
import { theme } from '../../src/theme/theme';

export default function AddSubscriptionScreen() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');
    const [renewalDate, setRenewalDate] = useState('');
    const [renewalPeriodValue, setRenewalPeriodValue] = useState('1');
    const [renewalPeriodUnit, setRenewalPeriodUnit] = useState('month');
    const [notifyBeforeValue, setNotifyBeforeValue] = useState('7');
    const [notifyBeforeUnit, setNotifyBeforeUnit] = useState('day');

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
        onError: (error: any) => {
            Alert.alert('Erro', error.response?.data?.message || 'Erro ao criar assinatura');
        }
    });

    const handleSubmit = () => {
        if (!serviceName || !price || !renewalDate) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
            return;
        }

        const newData = {
            service: { name: serviceName }, // Assumindo que o backend cria o serviço também
            price,
            renewal_date: renewalDate,
            renewal_period_value: parseInt(renewalPeriodValue),
            renewal_period_unit: renewalPeriodUnit,
            notify_before_value: parseInt(notifyBeforeValue),
            notify_before_unit: notifyBeforeUnit,
        };

        mutation.mutate(newData);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <MaterialIcons name="add-circle" size={24} color={theme.colors.primary} />
                <Text style={styles.title}>Nova Assinatura</Text>
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
                    title="Salvar Assinatura"
                    onPress={handleSubmit}
                    isLoading={mutation.isPending}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.m,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.l,
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
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
});