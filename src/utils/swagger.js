import swaggerJSDocs from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Adopción de Mascotas',
            version: '1.0.0',
            description: 'API REST para manejar un sistema completo de adopción de mascotas',
            contact: {
                name: 'API Support',
                email: 'support@adoptme.com'
            },
            license: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC'
            }
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor de desarrollo'
            },
            {
                url: 'https://your-production-url.com',
                description: 'Servidor de producción'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['first_name', 'last_name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único del usuario generado automáticamente',
                            example: '64a7b8c9d1234567890abcdef'
                        },
                        first_name: {
                            type: 'string',
                            description: 'Nombre del usuario',
                            example: 'Juan',
                            minLength: 2,
                            maxLength: 50
                        },
                        last_name: {
                            type: 'string',
                            description: 'Apellido del usuario',
                            example: 'Pérez',
                            minLength: 2,
                            maxLength: 50
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email único del usuario',
                            example: 'juan.perez@email.com'
                        },
                        password: {
                            type: 'string',
                            description: 'Contraseña encriptada del usuario',
                            example: '$2b$10$...',
                            minLength: 6
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'Rol del usuario en el sistema',
                            example: 'user',
                            default: 'user'
                        },
                        pets: {
                            type: 'array',
                            items: {
                                type: 'string',
                                description: 'ID de mascota adoptada'
                            },
                            description: 'Lista de IDs de mascotas adoptadas por el usuario',
                            example: ['64a7b8c9d1234567890abcd01', '64a7b8c9d1234567890abcd02']
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación del usuario',
                            example: '2023-07-07T10:30:00.000Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última actualización',
                            example: '2023-07-07T10:30:00.000Z'
                        }
                    }
                },
                UserInput: {
                    type: 'object',
                    required: ['first_name', 'last_name', 'email', 'password'],
                    properties: {
                        first_name: {
                            type: 'string',
                            description: 'Nombre del usuario',
                            example: 'Juan',
                            minLength: 2,
                            maxLength: 50
                        },
                        last_name: {
                            type: 'string',
                            description: 'Apellido del usuario',
                            example: 'Pérez',
                            minLength: 2,
                            maxLength: 50
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email único del usuario',
                            example: 'juan.perez@email.com'
                        },
                        password: {
                            type: 'string',
                            description: 'Contraseña del usuario (mínimo 6 caracteres)',
                            example: 'password123',
                            minLength: 6
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'Rol del usuario en el sistema',
                            example: 'user',
                            default: 'user'
                        }
                    }
                },
                UserUpdate: {
                    type: 'object',
                    properties: {
                        first_name: {
                            type: 'string',
                            description: 'Nombre del usuario',
                            example: 'Juan Carlos',
                            minLength: 2,
                            maxLength: 50
                        },
                        last_name: {
                            type: 'string',
                            description: 'Apellido del usuario',
                            example: 'Pérez García',
                            minLength: 2,
                            maxLength: 50
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Nuevo email del usuario',
                            example: 'juan.carlos@email.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'Nuevo rol del usuario',
                            example: 'admin'
                        }
                    },
                    description: 'Datos que pueden ser actualizados. Todos los campos son opcionales.'
                },
                Pet: {
                    type: 'object',
                    required: ['name', 'species', 'breed', 'age'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único de la mascota',
                            example: '64a7b8c9d1234567890abcd01'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre de la mascota',
                            example: 'Rex'
                        },
                        species: {
                            type: 'string',
                            description: 'Especie de la mascota',
                            example: 'Perro'
                        },
                        breed: {
                            type: 'string',
                            description: 'Raza de la mascota',
                            example: 'Golden Retriever'
                        },
                        age: {
                            type: 'integer',
                            description: 'Edad de la mascota en años',
                            example: 3
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción de la mascota',
                            example: 'Perro muy amigable y juguetón'
                        },
                        image: {
                            type: 'string',
                            description: 'URL de la imagen de la mascota',
                            example: 'https://example.com/pet-image.jpg'
                        },
                        adopted: {
                            type: 'boolean',
                            description: 'Estado de adopción',
                            example: false
                        },
                        owner: {
                            type: 'string',
                            description: 'ID del propietario si está adoptada',
                            example: '64a7b8c9d1234567890abcdef'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        payload: {
                            oneOf: [
                                { $ref: '#/components/schemas/User' },
                                {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/User' }
                                }
                            ]
                        }
                    }
                },
                UpdateResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'User updated'
                        },
                        userId: {
                            type: 'string',
                            example: '64a7b8c9d1234567890abcdef'
                        }
                    }
                },
                DeleteResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'User deleted'
                        },
                        userId: {
                            type: 'string',
                            example: '64a7b8c9d1234567890abcdef'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        error: {
                            type: 'string',
                            description: 'Mensaje descriptivo del error'
                        },
                        code: {
                            type: 'integer',
                            description: 'Código de estado HTTP'
                        }
                    }
                }
            },
            parameters: {
                userId: {
                    name: 'uid',
                    in: 'path',
                    required: true,
                    description: 'ID único del usuario',
                    schema: {
                        type: 'string',
                        pattern: '^[0-9a-fA-F]{24}$',
                        example: '64a7b8c9d1234567890abcdef'
                    }
                }
            },
            responses: {
                200: {
                    description: 'Operación exitosa',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' }
                        }
                    }
                },
                201: {
                    description: 'Recurso creado exitosamente',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' }
                        }
                    }
                },
                400: {
                    description: 'Solicitud incorrecta - Datos de entrada inválidos',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                missingId: {
                                    summary: 'ID faltante',
                                    value: {
                                        status: 'error',
                                        error: 'ID de usuario es requerido',
                                        code: 400
                                    }
                                },
                                invalidData: {
                                    summary: 'Datos inválidos',
                                    value: {
                                        status: 'error',
                                        error: 'Datos de actualización son requeridos',
                                        code: 400
                                    }
                                },
                                emailInUse: {
                                    summary: 'Email ya en uso',
                                    value: {
                                        status: 'error',
                                        error: 'El email ya está en uso',
                                        code: 409
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Usuario no encontrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                status: 'error',
                                error: 'Usuario no encontrado',
                                code: 404
                            }
                        }
                    }
                },
                500: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                status: 'error',
                                error: 'Error interno del servidor',
                                code: 500
                            }
                        }
                    }
                }
            }
        }
    },
    apis: [
        './src/routes/users.router.js',
        './src/routes/pets.router.js',
        './src/routes/mocks.router.js'
    ]
};

const specs = swaggerJSDocs(swaggerOptions);

export { specs, swaggerUi };