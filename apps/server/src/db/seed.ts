import { db } from './index';
import { books } from './schema';

async function seed() {
  try {
    await db.insert(books).values([
      {
        title: "L'Art d'Écrire",
        description: "Guide complet pour les écrivains en herbe",
        price: "29.99",
        imageUrl: "https://picsum.photos/200/300",
        stock: 10
      },
      {
        title: "Le Guide du Style",
        description: "Perfectionnez votre écriture",
        price: "24.99",
        imageUrl: "https://picsum.photos/200/300",
        stock: 15
      },
      {
        title: "Écriture Créative",
        description: "Techniques et exercices pratiques",
        price: "19.99",
        imageUrl: "https://picsum.photos/200/300",
        stock: 20
      }
    ]);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seed();