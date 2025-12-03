
import { RequestMapping } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { min } from 'rxjs';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({
        type: String,
        required: true,
        min: [3, 'name must be at least 3 characters'],
        max: [30, "name must be at most 30 characters"],
        trim:true
    })
    name: string;
    
    @Prop({
        // type: String,
        required: false,
        validate:{
            validator: function(v:string){
            //.test  -> true or false (match the pattern)
                return /^https?:\/\//.test(v); // يجب أن يكون URL صحيح
            
            },
            message:"Image must be valid URL"
        }
    })
    image?: string;


}

export const CategorySchema = SchemaFactory.createForClass(Category);
