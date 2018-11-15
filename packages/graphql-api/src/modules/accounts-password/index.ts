import { GraphQLModule } from '@graphql-modules/core';
import { AccountsPassword } from '@accounts/password';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import getSchemaDef from './schema/schema-def';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { AccountsRequest } from '../accounts';
import { mergeGraphQLSchemas } from '@graphql-modules/epoxy';

export interface AccountsPasswordModuleConfig {
  accountsPassword: AccountsPassword;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
}

export const AccountsPasswordModule = new GraphQLModule<
  AccountsPasswordModuleConfig,
  AccountsRequest
>({
  name: 'accounts-password',
  typeDefs: ({ config }) =>
    mergeGraphQLSchemas([
      TypesTypeDefs,
      getQueryTypeDefs(config),
      getMutationTypeDefs(config),
      ...(config.withSchemaDefinition ? [getSchemaDef(config)] : []),
    ]),
  resolvers: ({ config }) =>
    ({
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
    } as any),
  providers: ({ config }) => [
    {
      provide: AccountsPassword,
      useValue: config.accountsPassword,
    },
  ],
});