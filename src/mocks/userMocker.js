import { fakerES_MX as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateMockUsers = (num = 1) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('coder123', 10), // Contraseña encriptada
      role: Math.random() > 0.5 ? 'user' : 'admin',
      pets: [] // Array vacío
    });
  }
  return users;
};