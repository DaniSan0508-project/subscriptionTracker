import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, isLoading = false, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.components.button.padding,
    borderRadius: theme.components.button.borderRadius,
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.subtitle.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    fontSize: theme.typography.subtitle.fontSize,
  },
});

export default StyledButton;