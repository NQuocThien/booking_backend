import { Injectable, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JWtAuthGuard extends AuthGuard('jwt'){
    getRequest(context: ExecutionContext){
        const ctx = GqlExecutionContext.create(context)
        // console.log('test : ', ctx.getContext().req)
        return ctx.getContext().req;
    }
}