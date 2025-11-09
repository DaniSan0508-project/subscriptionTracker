import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subscription } from '../types';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onPress }) => {
  // Calcular dias até o vencimento
  const today = new Date();
  const renewalDate = new Date(subscription.renewal_date);
  const diffTime = renewalDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determinar status e cores
  let statusColor = theme.colors.primary; // Padrão: verde (bom)
  let statusText = 'Ativo';
  let showProgress = true;
  
  if (diffDays < 0) {
    statusColor = theme.colors.danger; // Vermelho (vencido)
    statusText = 'Vencido';
    showProgress = false;
  } else if (diffDays <= 3) {
    statusColor = theme.colors.danger; // Vermelho (vencimento iminente)
    statusText = 'Vence em breve';
  } else if (diffDays <= 7) {
    statusColor = theme.colors.warning; // Amarelo (próximo de vencer)
    statusText = 'Próximo de vencer';
  }

  // Formatar data
  const formattedDate = renewalDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <TouchableOpacity style={[styles.card, { borderColor: statusColor }]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{subscription.service.name}</Text>
          <Text style={styles.price}>R$ {parseFloat(subscription.price).toFixed(2)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.dateInfo}>
          <MaterialIcons name="event" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.dateText}>
            {diffDays > 0 ? `Vence em ${diffDays} dias` : `Venceu há ${Math.abs(diffDays)} dias`}
          </Text>
        </View>
        <Text style={styles.renewalDate}>{formattedDate}</Text>
      </View>
      
      {showProgress && (
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: statusColor,
                width: `${Math.min(100, Math.max(0, (diffDays / 30) * 100))}%` 
              }
            ]} 
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.components.card.borderRadius,
    padding: theme.components.card.padding,
    marginVertical: theme.spacing.s,
    marginHorizontal: theme.spacing.m,
    borderWidth: 1,
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.s,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: theme.typography.subtitle.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold' as 'bold',
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: 'bold' as 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  renewalDate: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: 'bold' as 'bold',
    color: theme.colors.text,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

export default SubscriptionCard;