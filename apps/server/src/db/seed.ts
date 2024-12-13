import { db } from './index';
import { books } from './schema';

async function seed() {
  try {
    // Insérer quelques livres de test
    await db.insert(products).values([
      {
        title: "L'Art de la Fiction",
        description: "Un guide complet pour les écrivains en herbe, couvrant tous les aspects de l'écriture créative.",
        price: "29.99",
        imageUrl: "https://example.com/art-fiction.jpg",
        stock: 50,
        authorId: "ID_DE_VOTRE_UTILISATEUR_TEST" // Remplacez par un ID valide
      },
      {
        title: "Le Guide du Développeur Full Stack",
        description: "Tout ce que vous devez savoir pour devenir un développeur full stack compétent.",
        price: "39.99",
        imageUrl: "https://example.com/dev-guide.jpg",
        stock: 30,
        authorId: "ID_DE_VOTRE_UTILISATEUR_TEST"
      },
      {
        title: "JavaScript: Les Bonnes Pratiques",
        description: "Un livre essentiel pour maîtriser les meilleures pratiques en JavaScript.",
        price: "34.99",
        imageUrl: "https://example.com/js-best-practices.jpg",
        stock: 25,
        authorId: "ID_DE_VOTRE_UTILISATEUR_TEST"
      }
    ]);

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seed();