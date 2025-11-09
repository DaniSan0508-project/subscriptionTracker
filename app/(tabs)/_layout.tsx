import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { theme } from '../../src/theme/theme'; // Importe nosso tema

// Helper para o ícone
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary, // Use a cor do nosso tema
      }}>
      
      {/* ABA 1: DASHBOARD */}
      <Tabs.Screen
        name="index" // app/(tabs)/index.tsx
        options={{
          title: 'Dashboard',
          headerShown: false, // Vamos esconder o header duplicado
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      
      {/* ABA 2: PERFIL */}
      <Tabs.Screen
        name="profile" // app/(tabs)/profile.tsx
        options={{
          title: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

      {/* Rota oculta para a tela de Adicionar (sem aba) */}
      <Tabs.Screen
        name="addSubscription" // app/(tabs)/addSubscription.tsx
        options={{
          // Esconde esta rota da barra de abas
          href: null,
          title: 'Adicionar Assinatura',
          headerShown: true, // Mostra o header
        }}
      />
    </Tabs>
  );
}
