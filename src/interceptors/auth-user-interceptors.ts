import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as requestContext from 'request-context';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  private static readonly _nameSpace = 'request';
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // console.log(
    //   '🚀 ~ file: auth-user-interceptors.ts:13 ~ AuthUserInterceptor ~ intercept ~ request:',
    //   request.headers,
    // );

    // make an api call to our go counterpart here. send jwt to them and u get the user details.
    const user = request.headers.host;
    // console.log(
    //   '🚀 ~ file: auth-user-interceptors.ts:23 ~ AuthUserInterceptor ~ intercept ~ user:',
    //   user,
    // );
    this.setAuthUser(user);

    console.log(request, 'ejo');

    return next.handle();
  }

  setAuthUser(user): void {
    console.log(
      '🚀 ~ file: auth-user-interceptors.ts:33 ~ AuthUserInterceptor ~ setAuthUser ~ user:',
      user,
    );
    requestContext.set(this._getKeyWithNamespace('vyouz'), user);
    requestContext.set('_aaaaa', 'wow');
  }

  getAuthUser() {
    return requestContext.get(this._getKeyWithNamespace('vyouz'));
  }

  _getKeyWithNamespace(key: string): string {
    return `${AuthUserInterceptor._nameSpace}.${key}`;
  }
}

// @AuthUser() user: UserDto,
