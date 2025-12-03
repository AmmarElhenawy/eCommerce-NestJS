import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import {User , UserSchema } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {responseDto} from '../response.dto';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from './dto/pagination.dto';
import { error } from 'console';
// import{User} fro

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel:Model<User>,
  private jwt:JwtService,
  private config:ConfigService
){}
  async create(createUserDto: CreateUserDto, payload) {
    // console.log(payload);
    // return "ok";
    // return this.userModel.create({...createUserDto,...payload});// if anything missed in dto payload will upadate it like role
    
    const existUser=await this.userModel.findOne({email:createUserDto.email });
    if(existUser){
      throw new BadRequestException("Email allready exist")
    }
    const existName=await this.userModel.findOne({name:createUserDto.name });
    if(existName){
      throw new BadRequestException("name have been used ")
    }
    const salt = await bcrypt.genSalt(10);
    createUserDto.password=await bcrypt.hash(createUserDto.password,salt);
    if (createUserDto.isActive==false) {
      throw new BadRequestException("isActive can't be false");
    }

    const user =await this.userModel.create({...createUserDto});
    
    const token= await this.signToken(user.id,user.email,user.role);
    return new responseDto(200,"created successfully",token)
    
  }

  async findAll(paginationDto:PaginationDto) {
    const  page=paginationDto.page??1;
    const  limit=paginationDto.limit??10;
    
    if (page<1){
      throw new BadRequestException('page number must be more than 0');
    }
    if (limit<1 || limit>100 ){
      throw new BadRequestException('limmit number must be between 1 and 100');
    }
    //filter

    //search
    const{ isActive,role,search }=paginationDto;
    const q:any={}
    
    if (isActive =='false' ){
      q.isActive=false
    }else{
      q.isActive=true
    }
    
    if (role){
      q.role=role
    }
    
    if(search){
      q.$or=[
        {name:{$regex: search,$options:'i'}},//q.name// i -> insesetive //regex pattern to search text  
        {email:{$regex: search,$options:'i'}}//q.email
      ]
    }
    //search

    //sort
const sortBy: 'name' | 'email' | 'createdAt' = paginationDto.sortBy ?? 'createdAt';
const sortOrder: 'asc' | 'desc' = paginationDto.sortOrder ?? 'desc';
    const s:any ={};
    s[sortBy] = sortOrder === 'asc'? 1 : -1;
    //sort
    
    //filter

    const skip=(page-1)*limit;
    
    const user= await this.userModel.find(q).select('-password -__v').skip(skip).limit(limit).sort(s);

    
    const total=await this.userModel.countDocuments();
    const totalPage=Math.ceil(total/limit);
    
    if (page>totalPage &&totalPage>0){
      throw new BadRequestException(`page ${page} doesn't exist .Total pages ${totalPage}`);
    }

    const hasNextPage=totalPage>page
    const hasPreviousPage=page>1
    
    const pagination={
      totalUers:total,
      totalPages:totalPage,
      currentPage:page,
      limit:limit,
      hasNextPage:hasNextPage,
      hasPreviousPage:hasPreviousPage,
      nextPage:hasNextPage?page+1:null,
      previousPage:hasPreviousPage?page-1:null,
    }

    return new responseDto(200,'successful',user,pagination);
  }

  async findOne(id: string) {
    const user= await this.userModel.findById(id)
    .select('-password -__v');
    if (!user) {
      return NotFoundException;
    }
    else{
      return new responseDto(200,'success',user);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExist=await this.userModel.findById(id);
    if (!userExist){
      throw new NotFoundException
    }
    const upadatedData={...updateUserDto}

    if(updateUserDto.password){
      const salt = await bcrypt.genSalt(10);
      upadatedData.password=await bcrypt.hash(updateUserDto.password,salt)
    }
    const updateUser=await this.userModel.findByIdAndUpdate(id,upadatedData,{new:true}).select('-password -__v');
    return new responseDto(200,'success',updateUser);
  }

  remove(id: string) {
    return this.userModel.findByIdAndUpdate(id,{isActive:false},{new:true}).select('-password -__v');
  }
  async getMe(payload){
    const user =await this.userModel.findById(payload.sub).select('-password -__v')
    console.log(payload);
      if (!user) {
      throw new NotFoundException;
    }
    else{
      return new responseDto(200,'success',user);
    }
  }
  async updateMe(payload,updateUserDto:UpdateUserDto){
        const upadatedData={...updateUserDto}

        const user =await this.userModel.findByIdAndUpdate(payload.sub,upadatedData,{new:true}).select('-password -__v')
        console.log(user);
        console.log(upadatedData);
      if (!user) {
      throw new NotFoundException;
    }
    else{
      return new responseDto(200,'success',user);
    }
  }
  async removeMe(payload){
      const user =await this.userModel.findByIdAndUpdate(payload.sub,{isActive:false},{new:true}).select('-password -__v')
      console.log(user)
      if (!user) {
      throw new NotFoundException;
    }
    else{
      return new responseDto(200,'success',user);
    }
  }

    async signToken(
    userId: number,
    email: string,
    role:string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        algorithm: 'HS256',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}
