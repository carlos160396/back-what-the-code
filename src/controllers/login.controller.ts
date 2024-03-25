// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {post, requestBody, response} from '@loopback/rest';
import {AuthToken} from '../interfaces/User';
import {JwtService} from '../services';

// import {inject} from '@loopback/core';

export class LoginController {
  constructor(
    @service(JwtService)
    public jwtService: JwtService,
  ) {}

  @post('/login')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: {
          properties: {
            token: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            id: {
              type: 'number',
            },
          },
        },
      },
    },
  })
  async auth(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    authToken: AuthToken,
  ): Promise<any> {
    return this.jwtService.auth(authToken);
  }
}
