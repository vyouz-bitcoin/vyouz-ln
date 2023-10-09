import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GoService } from '../modules/integrations/go/go.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(
      '🚀 ~ file: auth-user.decorator.ts:7 ~ request:',
      request.headers,
    );

    const goService = new GoService();

    // make a request to tobi once you get the user confirm if it is in my own db if not create
    console.log(goService.getHello());
    // this is where i will make the request
    return {
      firstName: 'adigun',
      lastName: 'john',
      country: 'nigeria',
      type: 'individual',
      email: 'segun@gmail.com',
    };
  },
);

//country
//email
//firstname
//lastname
//type : individual / organization
