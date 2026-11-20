import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // Importa  hook de tema

export default function SettingsScreen({ route,navigation }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const opciones = [
    {
      titulo: 'Información',
      icono: 'information-circle-outline',
      pantalla: 'Info',
      tipo: 'navegacion',
    },
    {
      titulo: 'Ayuda',
      icono: 'help-circle-outline',
      pantalla: 'Help',
      tipo: 'navegacion',
    },
    {
      titulo: 'Modo Oscuro',
      icono: 'color-palette-outline',
      tipo: 'switch',
    }
  ];

  // genera los estilos dinamicos usando los colores actuales
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Configuración
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {opciones.map((opcion, index) => {
          if (opcion.tipo === 'switch') {
            return (
              <View key={index} style={styles.option}>
                <Ionicons
                  name={opcion.icono}
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.optionText}>
                  {opcion.titulo}
                </Text>
                <Switch
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={'#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleTheme}
                  value={isDarkMode}
                />
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => navigation.navigate(opcion.pantalla)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={opcion.icono}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.optionText}>
                {opcion.titulo}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.inactive}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

//estilo cambian segun el tema activo
const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 64,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 19,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    padding: 15,
    marginBottom: 12,
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
});


