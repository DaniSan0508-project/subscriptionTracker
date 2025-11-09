import React from 'react';
import { TextInput, TextInputProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { theme } from '../theme/theme';

interface StyledInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  // Extend all TextInput props and potentially add custom ones
}

const StyledInput: React.FC<StyledInputProps> = (props) => {
  return <TextInput style={[styles.input, props.style]} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: theme.components.input.padding,
    paddingHorizontal: theme.components.input.padding,
    borderColor: theme.colors.border,
    borderWidth: theme.components.input.borderWidth,
    borderRadius: theme.components.input.borderRadius,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    width: '100%',
    marginBottom: theme.spacing.m,
  },
});

export default StyledInput;