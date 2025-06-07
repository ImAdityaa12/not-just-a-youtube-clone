import { appRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type VideoGetOneOutput = inferRouterOutputs<
    typeof appRouter
>['videos']['getOne'];
