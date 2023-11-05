import { Field, InputType } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class GeneralInforUpdateInput {
    @Field()
    company: string

    @Field()
    hotline: string

    @Field({ nullable: true })
    logoHeader: LinkImageInput

    @Field({ nullable: true })
    logoFooter: LinkImageInput

    @Field()
    email: string

    @Field()
    address: string

    @Field()
    liscenceBusiness: string

    @Field()
    liscenceOparating: string

    @Field()
    copyrigth: string
}
