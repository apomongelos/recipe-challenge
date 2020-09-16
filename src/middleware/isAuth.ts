import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<any> = async ({ context }, next) => {
  if (!context.email) {
    throw new Error('No esta autenticado');
  }
  return next();
};
