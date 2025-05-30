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
  INTERNAL_SERVER: {
    code: 500,
    message: 'Error interno del servidor.'
  }
};
