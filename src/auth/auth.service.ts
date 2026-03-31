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