import React, { 
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
 } from 'react';

 import * as api from '../services/contactsApi'

 const ContactsContext = createContext();

 //estado compartido de la lista (viene del server)
 export const ContactsProvider =({ children }) => {
    const [contacts, setContacts] = useState([]);
    const [status, setStatus] = useState('loading');//posibles resultados=loading,error,success
    const [error,setError] = useState('');

    //GET contactos
    const loadContacts = useCallback(async () => {
        setStatus('loading');
        setError('');
        try { 
            const data = await api.getContacts();
            setContacts(data);
            setStatus('success');
         } catch { 
            setError(error.message);
            setStatus('error');
          }
    }, []);

    //carga inicial 
    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    //POST 
    const addContact = async (data) => { 
        const created = await api.createContact(data);
        if (created) { 
            setContacts ((prev) => [...prev,created]);
         } else { 
            await loadContacts(); //se recarga la lista
          }
    };
    
    //PUT 
    const editContact = async (id, data) => {
        const updated = await api.updateContact(id, data);
        setContacts((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...data, ...(updated ?? {})} : c))
        );
    };

    //DELETE
    const removeContact = async (id) => {
        await api.deleteContact(id);
        setContacts((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <ContactsContext.Provider
        value={{contacts, status, error, loadContacts, addContact, editContact, removeContact}}
        >
            {children}
        </ContactsContext.Provider>
    );
} ;

export const useContacts = () => useContext(ContactsContext);