// export class ConfigJWT implements AuthenticationStrategy {

//   name: string = 'jwtPrueba';

//   async authenticate(request: Request<ParamsDictionary, any, any, ParsedQs>):
//     Promise<UserProfile | RedirectRoute | undefined> {

//     const token: string = this.extractCredentials(request);
//     const userProfile = await this.jwtService.verifyToken(token);
//     return Promise.resolve(userProfile);

//   }

// }
