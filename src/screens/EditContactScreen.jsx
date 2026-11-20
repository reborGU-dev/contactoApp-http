import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';

import ContactForm from '../components/ContactForm';
import * as api from '../services/contactsApi';
import { useContacts } from '../context/ContactsContext';
import { useTheme } from '../context/ThemeContext';
import { ScrollView } from 'react-native-gesture-handler';


export default function EditContactScreen({ route, navigation }) {

  const { id } = route.params;
  const { colors } = useTheme();
  const { editContact, removeContact } = useContacts();

  const [currentContact, setCurrentContact] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'success'
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  // GET recarga el formulario para editar al usuario
  const loadContact = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      const contact = await api.getContact(id);
      setCurrentContact(contact);
      setStatus('success');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  // PUT si falla el formulario muestra la alerta y no se cierra
  const handleSave = async (data) => {
    await editContact(id, data);
    navigation.goBack();
  };

  // DELETE 
  const handleDelete = () => {
    const titulo = 'Eliminar contacto';
    const mensaje = `¿Seguro que quieres eliminar a ${currentContact.nombre}?`;

    // hace el DELETE y regresa a la lista
    const eliminar = async () => {
      setDeleting(true);
      try {
        await removeContact(id);
        navigation.goBack();
      } catch (e) {
        const msg = e.message || 'No se pudo eliminar el contacto.';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('Error', msg);
        setDeleting(false);
      }
    };

    // en web Alert.alert no funcionaasi que  se usa confirmacion del navegador
    if (Platform.OS === 'web') {
      if (window.confirm(`${titulo}\n\n${mensaje}`)) eliminar();
      return;
    }

    Alert.alert(titulo, mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: eliminar },
    ]);
  };
  const styles = createStyles(colors);

  // cargando
  if (status === 'loading') {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>Cargando contacto...</Text>
      </View>
    );
  }

  // error en la peticion
  if (status === 'error' || !currentContact) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadContact}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <ContactForm
        buttonLabel="Editar"
        initialData={currentContact}
        onSaveContact={handleSave}
      />

    
    {/* Btn para eliminar usuario (solo sale en esta pantalla) */}
      <Pressable
        style={[styles.deleteButton, deleting && styles.deleteDisabled]}
        onPress={handleDelete}
        disabled={deleting}>
        
      <Text 
        style={styles.deleteText}> 
          {deleting ? 'Eliminando...' : 'Eliminar'}
      </Text>
      </Pressable>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    marginTop: 12,
    fontSize: 15,
    color: colors.secondary,
  },

  errorText: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.danger,
    marginBottom: 12,
  },

  retryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  retryText: {
    color: colors.primary,
    fontWeight: '600',
  },

  deleteButton: {
      borderWidth: 1,
      borderColor: colors.danger,
      padding: 15,
      borderRadius: 10,
      marginHorizontal: 15,
      alignItems: 'center',
  },
  deleteDisabled: {
      opacity: 0.6,
  },
  deleteText: {
      color: colors.danger,
      fontSize: 15,
      fontWeight: '600',
  },
});