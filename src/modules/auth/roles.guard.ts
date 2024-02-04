import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './entities/role.enum';
import { ROLES_KEY } from './roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]); // lấy mãng các role đã ràn bộc ở resolver
    console.log('=>Role');
    if (!requiredRoles) {
      // nếu ko có ràn buộc quyền return true
      console.log('\t-> Ko có role');
      return true;
    }

    const user = GqlExecutionContext.create(context).getContext().req?.user; // vì ở JWtAuthGuard trả về context dạng GqlExecutionContext
    // if (!user?.roles) return;
    if (!user) return false;
    else {
      console.log('\t-> Required roles: ', requiredRoles);
      console.log('\t-> roles: ', user?.roles);
      if (user?.roles?.includes(Role.Admin)) return true;
    }
    return requiredRoles.some((role) => user.roles?.includes(role)); // duyệt qua cái role đã thiết lập nếu user có 1 role thỏ => true
  }
}
