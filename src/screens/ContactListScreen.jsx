
import React, { useState, useMemo } from 'react';

import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import ContactCard from '../components/ContactCard';
import HeaderMenu from '../components/HeaderMenu';

import { useContacts } from '../context/ContactsContext';
import { globalStyles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';

// ignorar mayusculas y acentos
const normalizeText = (text) => {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export default function ContactListScreen({ navigation }) {

  const { colors } = useTheme();
  const styles = createStyles(colors);

  // contactos y estado del GET 
  const { contacts: list, status, error, loadContacts } = useContacts();
  const [search, setSearch] = useState('');

  // filtrar contactos 
  const filteredContacts = useMemo(() => {

    const query = normalizeText(search);

    if (!query) {
      return list;
    }

    return list.filter((contact) => {

      const searchableFields = [
        contact.nombre,
        contact.apellido,
        contact.telefono,
        contact.correo,
        contact.tipo,
      ];

      return searchableFields.some((field) =>
        normalizeText(field).includes(query)
      );

    });

  }, [list, search]);

  return (

    <View style={styles.container}>

      {/* menu principal */}
      <View style={styles.headerContainer}>
        <HeaderMenu />
      </View>

      {/* barra de busqueda */}
      <View style={styles.searchContainer}>

        <Text style={styles.searchIcon}>
          
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar contacto..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Text style={styles.clearText}>
              ✕
            </Text>
          </Pressable>
        )}

      </View>

      {/* lista de contactos */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(contact) => contact.id}
        renderItem={({ item }) => (

          <ContactCard
            contact={item}
            onPress={() =>
              navigation.navigate('EditContact', {
                id: item.id,
              })
            }
          />

        )}
        ListEmptyComponent={

          status === 'loading' ? (

            // cargando
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.empty}>Cargando contactos...</Text>
            </View>

          ) : status === 'error' ? (

            // error en la peticion
            <View style={styles.centered}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={loadContacts}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>

          ) : (

            // sin contactos
            <Text style={styles.empty}>
              {search.trim()
                ? 'No se encontraron contactos.'
                : 'No hay contactos.'}
            </Text>

          )

        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />

      {/* Btn agregar contacto */}
      <Pressable
        style={globalStyles.button}
        onPress={() => navigation.navigate('NewContact')}
      >
        <Text style={globalStyles.buttonText}>
          Agregar contacto
        </Text>
      </Pressable>

    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  headerContainer: {
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 50,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 8,
  },

  clearText: {
    fontSize: 18,
    color: colors.secondary,
    paddingHorizontal: 5,
  },

  list: {
    flexGrow: 1,
    paddingBottom: 10,
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: colors.secondary,
  },

  centered: {
    alignItems: 'center',
    marginTop: 30,
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

});
