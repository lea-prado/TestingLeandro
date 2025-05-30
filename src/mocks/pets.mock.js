import { fakerES_MX as faker } from '@faker-js/faker';

export const generateMockPets = (count = 100) => {
    const species = ['dog', 'cat', 'rabbit', 'parrot'];
    const pets = [];

    for (let i = 0; i < count; i++) {
        pets.push({
            name: faker.person.firstName(),
            specie: faker.helpers.arrayElement(species),
            birthDate: faker.date.birthdate({ min: 1, max: 15, mode: 'age' }),
            adopted: false,
            image: faker.image.urlPicsumPhotos({ width: 300, height: 300 })
        });
    }

    return pets;
};
