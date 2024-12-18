import { db } from './db';
import { users, books } from './db/schema';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
  try {
    // Étape 1 : Ajouter un utilisateur
    const userId = uuidv4(); // Crée un UUID unique pour l'auteur
    await db.insert(users).values({
      id: userId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123',
    });

    console.log(`Utilisateur inséré avec l'ID : ${userId}`);

    // Étape 2 : Ajouter des livres pour cet utilisateur
    await db.insert(books).values([
      {
        id: uuidv4(),
        title: 'Livre 1',
        description: 'Description du Livre 1',
        price: '10.99',
        imageUrl: 'https://example.com/livre1.jpg',
        stock: 10,
        authorId: userId, // Référence à l'utilisateur inséré ci-dessus
        content: 'Contenu du Livre 1',
      },
      {
        id: uuidv4(),
        title: 'Livre 2',
        description: 'Description du Livre 2',
        price: '12.99',
        imageUrl: 'https://example.com/livre2.jpg',
        stock: 8,
        authorId: userId,
        content: 'Contenu du Livre 2',
      },
    ]);

    console.log('Données insérées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    process.exit();
  }
};

seed();
