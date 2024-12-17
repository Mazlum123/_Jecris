import { db } from '../db';
import { books } from '../db/schema';
import { eq } from 'drizzle-orm';

const TEST_CONTENT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`.repeat(100);

async function addTestContent() {
  try {
    await db.update(books)
      .set({ content: TEST_CONTENT })
      .where(eq(books.id, '6b4e0654-a984-41ac-8dc6-ef55dfe7c566')); // ID de votre livre

    console.log('Contenu de test ajouté avec succès !');
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

addTestContent();