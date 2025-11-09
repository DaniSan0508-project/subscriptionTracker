import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { theme } from '../../src/theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

// Helper para o ícone
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}>

      {/* ABA 1: DASHBOARD */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Assinaturas',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="receipt" color={color} />,
          headerRight: () => (
            <Pressable onPress={() => {}}>
              <View style={{ marginRight: 15 }}>
                <MaterialIcons name="notifications" size={24} color={theme.colors.text} />
              </View>
            </Pressable>
          ),
        }}
      />

      {/* ABA 2: PERFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}