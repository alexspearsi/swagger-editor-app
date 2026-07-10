import { ConfigService } from '@nestjs/config';

import { createNestApp } from './create-app';

async function bootstrap() {
  const app = await createNestApp();

  const port = app.get(ConfigService).getOrThrow<number>('PORT');
  await app.listen(port);
}
bootstrap();
