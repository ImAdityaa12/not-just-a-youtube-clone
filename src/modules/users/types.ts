import { AppRouter, appRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type UserGetOneOutput = inferRouterOutputs<
    typeof appRouter
>['users']['getOne'];
