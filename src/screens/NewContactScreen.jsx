import React from 'react';
import ContactForm from '../components/ContactForm';
import { useContacts } from '../context/ContactsContext';


export default function NewContactScreen({ navigation }) {

  const { addContact } = useContacts();

  //POST
  const handleSaveContact = async (contacto) => {
    // registra el contacto en el almacenamiento
    await addContact(contacto);

    // regresa a la agenda
    navigation.navigate('Home');
  };

  return (

      <ContactForm
        buttonLabel="Guardar contacto"
        onSaveContact={handleSaveContact}
      />

  );
}
