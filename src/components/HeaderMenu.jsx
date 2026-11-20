import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function HeaderMenu() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    setVisible(false);
    navigation.navigate(screen);
  };

  return (
    <View>
      <Pressable onPress={() => setVisible(true)} style={styles.iconButton}>
        <Ionicons name="menu" size={30} color={colors.primary} />
      </Pressable>

      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          {/* El Pressable vacio actua como btn para cerrar al tocar el fondo oscuro */}
          <Pressable style={styles.backgroundTouchable} onPress={() => setVisible(false)} />
          
          <View style={styles.menu}>
            <Pressable style={styles.menuItem} onPress={() => navigateTo('Info')}>
              <Text style={styles.menuText}>Información</Text>
            </Pressable>
            
            <Pressable style={styles.menuItem} onPress={() => navigateTo('Help')}>
              <Text style={styles.menuText}>Ayuda</Text>
            </Pressable>
            
            <Pressable style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => navigateTo('Settings')}>
              <Text style={styles.menuText}>Configuración</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  iconButton: {
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'flex-end', 
  },
  backgroundTouchable: {
    flex: 1, 
  },
  menu: {
    backgroundColor: colors.white,
    width: '75%', 
    height: '100%', 
    paddingTop: 60, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  }
});