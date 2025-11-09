import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import StyledInput from '../../src/components/StyledInput';
import StyledButton from '../../src/components/StyledButton';
import { theme } from '../../src/theme/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const result = await signIn(email, password);

    if (!result.success) {
      Alert.alert('Erro no Login', result.error);
      setIsLoading(false);
    } else {
      // On success, the layout will handle redirecting automatically
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

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

        <StyledButton
          style={styles.button}
          title="Entrar"
          onPress={handleSignIn}
          isLoading={isLoading}
        />

        <Text style={styles.registerText}>
          Não tem conta?{' '}
          <Text style={styles.registerLink} onPress={handleGoToRegister}>
            Cadastre-se
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
  registerText: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
  },
  registerLink: {
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