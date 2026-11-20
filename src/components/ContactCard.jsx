import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';


export default function ContactCard({ contact, onPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (

    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>{contact.nombre} {contact.apellido}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{contact.tipo}</Text>
        </View>
      </View>
      <Text style={styles.text}>{contact.telefono}</Text>
      <Text style={styles.text}>{contact.correo}</Text>
      <Text style={styles.text}>{contact.edad} años · {contact.fechaNacimiento}</Text>
    </Pressable>

  );
}

const createStyles = (colors) => StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.text,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    color: colors.text,
  },
  text: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 2,
  }
});
