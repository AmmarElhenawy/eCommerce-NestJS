import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { responseDto } from 'src/response.dto';

@Injectable()
export class CategoryService {
  constructor
(  @InjectModel(Category.name) private categoryModel:Model<Category>
  // private jwt:JwtService,
  // private config:ConfigService
  ){}
  async create(createCategoryDto: CreateCategoryDto) {
    const category=await this.categoryModel.findOne({name:createCategoryDto.name})
    if (category) {
      throw new BadRequestException("this category is allready exist")
    };
    const newCategory=await this.categoryModel.create(createCategoryDto);
    return new responseDto(200,'category created successfuly',newCategory);
  }

  async findAll() {
    const category= await this.categoryModel.find().select('-__v');
    if (category.length===0){
      throw new BadRequestException("categories are empty");
    }
    return new responseDto(200,'success',category);
  }

  async findOne(id: string) {
    const category=await this.categoryModel.findById(id);
        if (!category){
      throw new BadRequestException('categories doesn\'t  exist ')
    }
    return new responseDto(200,'success',category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findById(id);
    if (!category)
    {
      throw new BadRequestException('category does\'t exist')
    }
    const updatedCategory=await this.categoryModel.findByIdAndUpdate(id,updateCategoryDto,{new:true})
    .select('-__v');
    return new responseDto(200,"success",updatedCategory);
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category)
    {
      throw new BadRequestException('category does\'t exist')
    }
    const deletedCategory=await this.categoryModel.findByIdAndDelete(id);
    return new responseDto(200,'succes',deletedCategory);
  }
}
