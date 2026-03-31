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