// configuracion del servidor de CESUN
// en web el navegador puede bloquear por CORS
export const BASE_URL = 'https://cesun.vkinf-software.com:7800';
export const SERIAL_NUMBER = '24010178';

export const CONTACTS_PATH = `/api/contacts/${SERIAL_NUMBER}`;
//export const CONTACTS_PATH = '/api/slow/';
//export const CONTACTS_PATH = '/api/error/';

export const LIST_PATH_OVERRIDE = null;
;

export const REQUEST_TIMEOUT = 10000;