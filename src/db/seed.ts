import 'dotenv/config';
import { db } from '../index';
import { brands, models, selections } from './schema';

async function main() {
  console.log('Début du seeding...');

  try {
    // Nettoyage de la base
    await db.delete(selections);
    await db.delete(models);
    await db.delete(brands);

    // Insertion des Marques
    console.log('Insertion des marques...');
    
    // On insère et on récupère l'ID créé immédiatement
    const [toyota] = await db.insert(brands)
      .values({ name: 'TOYOTA' })
      .returning();

    const [renault] = await db.insert(brands)
      .values({ name: 'RENAULT' })
      .returning();

    // Insertion des Modèles
    console.log('Insertion des modèles...');

    await db.insert(models).values([
      // Modèles Toyota
      { name: 'Avensis', brandId: toyota.id },
      { name: 'Aygo', brandId: toyota.id },
      { name: 'Prius', brandId: toyota.id },
      { name: 'Yaris', brandId: toyota.id },
      
      // Modèles Renault
      { name: 'Clio', brandId: renault.id },
      { name: 'Espace', brandId: renault.id },
      { name: 'Mégane', brandId: renault.id },
      { name: 'Scenic', brandId: renault.id },
    ]);

    console.log('Seeding terminé avec succès !');
    process.exit(0);
    
  } catch (error) {
    console.error('ERREUR durant le seeding :', error);
    process.exit(1);
  }
}

main();