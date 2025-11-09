import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import StyledInput from '../../src/components/StyledInput';
import StyledButton from '../../src/components/StyledButton';
import { theme } from '../../src/theme/theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);

    if (password !== password_confirmation) {
      Alert.alert('Erro', 'As senhas não conferem');
      setIsLoading(false);
      return;
    }

    const result = await register(name, email, password, password_confirmation);

    if (!result.success) {
      Alert.alert('Erro no Cadastro', result.error);
      setIsLoading(false);
    } else {
      // On success, the layout will handle redirecting automatically
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastre-se</Text>

        <StyledInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome"
          autoCapitalize="words"
        />

        <StyledInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <StyledInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry={true}
        />

        <StyledInput
          style={styles.input}
          value={password_confirmation}
          onChangeText={setPasswordConfirmation}
          placeholder="Confirmar Senha"
          secureTextEntry={true}
        />

        <StyledButton
          style={styles.button}
          title="Criar Conta"
          onPress={handleRegister}
          isLoading={isLoading}
        />

        <Text style={styles.loginText}>
          Já tem conta?{' '}
          <Text style={styles.loginLink} onPress={handleGoToLogin}>
            Faça o Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  formContainer: {
    width: '90%',
    alignItems: 'stretch', // Faz os filhos (inputs/buttons) preencherem a largura
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  loginText: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  input: {
    width: '100%', // Para sobrescrever o '90%' do componente
  },
  button: {
    width: '100%', // Para sobrescrever o '90%' do componente
  },
});