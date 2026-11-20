import {
  BASE_URL,
  CONTACTS_PATH,
  LIST_PATH_OVERRIDE,
  REQUEST_TIMEOUT,
} from '../config/api';

// error con el codigo de estado
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// mensjae segun el codigo de rror
const messageForStatus = (status) => {
  if (status === 404) return 'No se encontró el contacto en el servidor.';
  if (status === 400 || status === 422) return 'El servidor rechazó los datos enviados.';
  if (status >= 500) return 'El servidor tuvo un problema. Intenta de nuevo más tarde.';
  return `La petición falló (código ${status}).`;
};

// peticion y devuelve el json
async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    throw new ApiError(
      e.name === 'AbortError'
        ? 'El servidor tardó demasiado en responder.'
        : 'No se pudo conectar con el servidor. Revisa tu conexión.'
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();

  // cualquier cosa fuera de 200-299 es error
  if (!response.ok) {
    // 400/422 para exlciar que esta fallando
    console.warn(`[API] ${method} ${path} -> ${response.status}`, text);
    const detail = response.status === 400 || response.status === 422
      ? ` ${text.slice(0, 200)}`
      : '';
    throw new ApiError(messageForStatus(response.status) + detail, response.status);
  }

  // 204 No Content o cuerpo vacío
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('La respuesta del servidor no tiene un formato válido.', response.status);
  }
}


const fromApi = (c) => ({
  id: String(c.id),
  nombre: c.first_name ?? '',
  apellido: c.last_name ?? '',
  edad: c.age == null ? '' : String(c.age),
  correo: c.email ?? '',
  telefono: c.phone ?? '',
  fechaNacimiento: c.birth_date ?? '',
  tipo: c.contact_type ?? 'Personal',
});

const toApi = (c) => {
  const body = {
    first_name: c.nombre,
    phone: c.telefono,
    contact_type: c.tipo,
  };
  if (c.apellido?.trim()) body.last_name = c.apellido;
  if (c.correo?.trim()) body.email = c.correo;
  if (String(c.edad ?? '').trim() !== '') body.age = Number(c.edad);
  body.birth_date = c.fechaNacimiento || null;
  return body;
};

// Rutas (el servidor usa diagonal final)
const listPath = () => `${LIST_PATH_OVERRIDE ?? CONTACTS_PATH}/`;
const itemPath = (id) => `${CONTACTS_PATH}/${id}/`;

// GET 
export async function getContacts() {
  const data = await request(listPath());
  const list = Array.isArray(data) ? data : data?.results ?? data?.contacts ?? [];
  return list.map(fromApi);
}

// GET 
export async function getContact(id) {
  const data = await request(itemPath(id));
  return fromApi(data);
}

// POST devuelve el contacto creado (con su id)
export async function createContact(contact) {
  const data = await request(listPath(), { method: 'POST', body: toApi(contact) });
  return data && data.id != null ? fromApi(data) : null;
}

// PUT 
export async function updateContact(id, contact) {
  const data = await request(itemPath(id), { method: 'PUT', body: toApi(contact) });
  return data && data.id != null ? fromApi(data) : null;
}

// DELETE  (borrado en el servidor)
export async function deleteContact(id) {
  await request(itemPath(id), { method: 'DELETE' });
}

