export default class CustomError {
  static createError({ name = 'Error', cause, message, code = 500 }) {
    const error = new Error(message);
    error.name = name;
    error.cause = cause;
    error.code = code;
    throw error;
  }
}

export const ErrorDictionary = {
  REGISTER_USER: {
    code: 400,
    message: 'Error al registrar el usuario. Campos obligatorios faltantes o inválidos.'
  },
  CREATE_PET: {
    code: 400,
    message: 'Error al crear mascota. Verifica los datos ingresados.'
  },
  USER_NOT_FOUND: {
    code: 404,
    message: 'Usuario no encontrado.'
  },
  PET_NOT_FOUND: {
    code: 404,
    message: 'Mascota no encontrada.'
  },
  ADOPTION_NOT_FOUND: {
    code: 404,
    message: 'Adopción no encontrada.'
  },
  PET_ALREADY_ADOPTED: {
    code: 400,
    message: 'La mascota ya ha sido adoptada.'
  },
  INVALID_DATA_TYPE: {
    code: 400,
    message: 'Los parámetros deben ser números válidos.'
  },
  INVALID_CREDENTIALS: {
    code: 401,
    message: 'Credenciales inválidas.'
  },
  INTERNAL_SERVER: {
    code: 500,
    message: 'Error interno del servidor.'
  }
};