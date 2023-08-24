import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { Certificate } from '../entities/certificate'
import { User } from 'src/modules/users/entities/user.entity'
import { Experience } from '../entities/experience'
import { Education } from '../entities/education'
import { Prize } from '../entities/Prize'
@Schema({
    timestamps:true
})
export class Profile{
    @Prop({nullable: true})
    introduce: string
  
    @Prop()
    userId: string
  
    @Prop({nullable: true})
    experience: Experience
  
    @Prop({nullable: true})
    skills: string
  
    @Prop({nullable: true})
    certificate: Certificate // chứng chỉ
  
    @Prop({nullable: true})
    education: Education
  
    @Prop({nullable: true})
    prize: Prize  
  
    // @Prop(() => [User])
    // user: User[]
}
export const ProfileSchema = SchemaFactory.createForClass(Profile)