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

##### Install---

```bash
npm i @nestjs/jwt passport-jwt @nestjs/passport passport
npm i bcrypt
npm i --save-dev @types/bcrypt
```

##### Create---

```bash
nest g module auth
nest g service auth
nest g controller auth
nest g class auth/user.schema --flat
```

#### user.schema.ts
```bash
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = UserSchema & Document;

@Schema()

export class UserSchema {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
```

##### .env file e JWT_SECRET_KEY add koro---

#### .env
```bash
MONGODB_DATABASE_URL=mongodb+srv://abutaherrnb64_db_user:7PcXTNZMcwpZaaQG@cluster0.pfwfa6z.mongodb.net/?appName=Cluster0
JWT_SECRET_KEY=wasim123_secret_key
```

#### auth.module.ts
```bash
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaFactory } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserSchema.name, schema: UserSchemaFactory }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      })
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
```