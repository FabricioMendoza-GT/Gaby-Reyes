import app from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';

async function bootstrap() {
  await AppDataSource.initialize();

  app.listen(env.port,  '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`BioinSight backend running on port ${env.port}`);
  });
}

void bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start backend', error);
  process.exit(1);
});