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
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.MONGODB_DATABASE_URL!), AuthModule
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

##### Create--- auth/jwt.strategy.ts

#### jwt.strategy.ts
```bash
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }
    async validate(payload: any) {
            return { userId: payload.sub, email: payload.email };
        }
}
```

##### auth.module.ts file e providers e add koro JwtStrategy

#### auth.module.ts
```bash
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaFactory } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

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
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
```

#### auth.service.ts
```bash
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor( @InjectModel(UserSchema.name) private userModel: Model<UserDocument>, private jwtService: JwtService, ) {}

    async signup( email: string, password: string ) {
        const hash = await bcrypt.hash( password, 10 );
        const user = new this.userModel({ email, password: hash });
        await user.save();
        return { message: 'User created successfully' };
        // return user.save();
    }

    async login( email: string, password: string ) {
        const user = await this.userModel.findOne({ email });
        if( !user ) return null;
        const isPasswordValid = await bcrypt.compare( password, user.password );
        if( !isPasswordValid ) return null;
        const payload = { email: user.email, sub: user._id };
        return { access_token: this.jwtService.sign( payload ), };
    }

}
```

#### auth.controller.ts
```bash
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor( private authService: AuthService ) {}

    @Post('signup')
    async signup( @Body() body: { email: string, password: string } ) {
        return this.authService.signup( body.email, body.password );
    }

    @Post('login')
    async login( @Body() body: { email: string, password: string } ) {
        return this.authService.login( body.email, body.password );
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile( @Request() req ) {
        return req.user;
    }

}
```

##### method: POST url: http://localhost:3000/auth/signup
![](/public/Img/usercreated.png)

##### MongoDB database
![](/public/Img/userSchema.png)

##### method: POST url: http://localhost:3000/auth/login
![](/public/Img/userlogin.png)

##### method: GET url: http://localhost:3000/auth/profile
![](/public/Img/auth.png)