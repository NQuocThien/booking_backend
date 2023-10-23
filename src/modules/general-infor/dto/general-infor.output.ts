import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GeneralInforOutput {
    @Field()
    company: string

    @Field()
    hotline: string

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
