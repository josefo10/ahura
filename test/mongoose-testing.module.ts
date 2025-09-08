import { MongooseModule } from '@nestjs/mongoose';

export const MongooseTestingModule = (entities: any[]) => MongooseModule.forRoot('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});