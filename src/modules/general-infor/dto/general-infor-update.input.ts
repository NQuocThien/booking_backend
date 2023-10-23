import { Field, InputType } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class GeneralInforUpdateInput {
    @Field()
    company: string

    @Field()
    hotline: string

    @Field()
    logoHeader: LinkImageInput

    @Field()
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
