
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { min } from 'rxjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({
        type: String,
        required: true,
        min: [3, 'name must be at least 3 characters'],
        max: [30, "name must be at most 30 characters"]
    })
    name: string;

    @Prop({
        type: Number
    })
    age: number;

    @Prop({
        type: String,
        required: true,
        unique: true,

    })
    email: string;

    @Prop({
        type: Boolean,
        required: true,
    })
    isActive: boolean;

    @Prop({
        type: String,
        required: true,
        min: [3, 'password must be at least 3 characters'],
        max: [20, "password must be at most 30 characters"],
        select: false

    })
    password: string;

    @Prop({
        required: true,
        enum: ['user', 'admin']
    })
    role: string;
    @Prop({
        type: String
    })
    avatar: string;

    @Prop({
        type: String,
        // min: [11, "must be at least 11 numbers"]
    })
    phone: string;

    @Prop({
        type: String,
    })
    address: string;

    @Prop({
        // required: true,
        // enum:[true,false]
    })
    active: boolean;

    @Prop({


    })
    verfictionCode?: number;

    @Prop(
        {
            type: String,
            enum: ["male", "female"]
        }
    )
    gender: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
