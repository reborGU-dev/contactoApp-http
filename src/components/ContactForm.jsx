
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

import DateField from './DateField';
import { CONTACT_TYPES } from '../data/contact';
import { useTheme } from '../context/ThemeContext';

export default function ContactForm({
  onSaveContact,
  buttonLabel = "Guardar",
  initialData = {},
}) {

  // tema global
  const { colors } = useTheme();

  // Estados del formulario
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [apellido, setApellido] = useState(initialData.apellido || '');
  const [edad, setEdad] = useState(initialData.edad || '');
  const [telefono, setTelefono] = useState(initialData.telefono || '');
  const [correo, setCorreo] = useState(initialData.correo || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(
    initialData.fechaNacimiento || ''
  );
  const [tipo, setTipo] = useState(
    initialData.tipo || CONTACT_TYPES[0]
  );

  // estilos dinamios
  const styles = createStyles(colors);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {

    if (!nombre.trim() || !telefono.trim()) {
      Alert.alert(
        'Campos obligatorios',
        'Por favor ingresa al menos el Nombre y Teléfono'
      );
      return;
    }

    if (typeof onSaveContact !== 'function') {
      Alert.alert(
        'Error',
        'No se pudo guardar el contacto.'
      );
      return;
    }

    const newContact = {
      nombre,
      apellido,
      edad,
      telefono,
      correo,
      fechaNacimiento,
      tipo,
    };

    //hace peticion http si falla no se guarda el contacto
    setSaving(true);
    try{
      await onSaveContact(newContact);
    } catch (e) { 
      Alert.alert('Error', e.message || 'No se pudo guardar el contacto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >

      <Text style={styles.label}>Nombre</Text>

      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingresa el nombre"
        placeholderTextColor={colors.inactive}
      />

      <Text style={styles.label}>Apellido</Text>

      <TextInput
        style={styles.input}
        value={apellido}
        onChangeText={setApellido}
        placeholder="Ingresa el apellido"
        placeholderTextColor={colors.inactive}
      />

      <Text style={styles.label}>Edad</Text>

      <TextInput
        style={styles.input}
        value={edad}
        keyboardType="numeric"
        onChangeText={setEdad}
        placeholder="Ingresa la edad"
        placeholderTextColor={colors.inactive}
      />

      <Text style={styles.label}>Correo</Text>

      <TextInput
        style={styles.input}
        value={correo}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setCorreo}
        placeholder="Ingresa el correo"
        placeholderTextColor={colors.inactive}
      />

      <Text style={styles.label}>Teléfono</Text>

      <TextInput
        style={styles.input}
        value={telefono}
        keyboardType="phone-pad"
        onChangeText={setTelefono}
        placeholder="Ingresa el teléfono"
        placeholderTextColor={colors.inactive}
      />

      <DateField
        label="Fecha de nacimiento"
        value={fechaNacimiento}
        onChange={setFechaNacimiento}
      />

      <Text style={styles.label}>Tipo de contacto</Text>

      <View style={styles.typeContainer}>
        {CONTACT_TYPES.map(t => (
          <Pressable
            key={t}
            style={[
              styles.typeBadge,
              tipo === t && styles.typeBadgeActive,
            ]}
            onPress={() => setTipo(t)}
          >
            <Text
              style={[
                styles.typeText,
                tipo === t && styles.typeTextActive,
              ]}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color='#FFFFFF'/>
          ) : (
            <Text style={styles.buttonText}>
              {buttonLabel}
            </Text>
          )}
      </Pressable>

      
    </ScrollView>
  );
}

// estilos que cambian segun el tema
const createStyles = (colors) => StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.input,
    color: colors.text,
  },

  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },

  typeBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },

  typeBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  typeText: {
    color: colors.text,
  },

  typeTextActive: {
    color: '#FFFFFF',
  },

  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonDisabled:{
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

});
