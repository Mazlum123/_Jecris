import { Router } from 'express';
import { db } from './db';

const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    await db.query.users.findMany({ limit: 1 });

    // Vérifier l'espace disque
    const diskSpace = await checkDiskSpace();

    // Vérifier la mémoire
    const memory = process.memoryUsage();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      diskSpace,
      memory: {
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default healthRouter;