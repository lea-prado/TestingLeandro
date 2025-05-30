import { fakerES_MX as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const hashPassword = (password) => bcrypt.hashSync(password, 10);

export const generateMockPets = (qty = 100) => {
  const pets = [];
  for (let i = 0; i < qty; i++) {
    pets.push({
      name: faker.animal.dog(),
      specie: faker.animal.type(),
      birthDate: faker.date.birthdate(),
      adopted: false,
      image: faker.image.url(),
    });
  }
  return pets;
};

export const generateMockUsers = (qty = 50) => {
  const users = [];
  for (let i = 0; i < qty; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: hashPassword('coder123'),
      role: faker.helpers.arrayElement(['user', 'admin']),
      pets: []
    });
  }
  return users;
};
