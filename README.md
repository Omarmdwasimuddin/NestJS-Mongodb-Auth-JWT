## JWT Authentication with MongoDB

##### Install---

```bash
npm i @nestjs/config
npm i @nestjs/mongoose mongoose
```

##### Create .env file from root
###### Mongodb atlas er database url .env file e rakho

#### .env
```bash
MONGODB_DATABASE_URL=mongodb+srv://abutaherrnb64_db_user:7PcXTNZMcwpZaaQG@cluster0.pfwfa6z.mongodb.net/?appName=Cluster0
```

##### app.module.ts file e ConfigModule o MongooseModule add koro

#### app.module.ts
```bash
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_DATABASE_URL!)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```