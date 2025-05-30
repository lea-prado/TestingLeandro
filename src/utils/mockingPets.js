import { fakerES as faker } from '@faker-js/faker';

export const generateMockPets = (count = 100) => {
  const pets = [];

  for (let i = 0; i < count; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.animal.dog(), // o cat, o random
      specie: faker.animal.type(),
      birthDate: faker.date.past({ years: 5 }),
      adopted: false,
      owner: null,
      image: faker.image.urlLoremFlickr({ category: 'animals' }),
    });
  }

  return pets;
};