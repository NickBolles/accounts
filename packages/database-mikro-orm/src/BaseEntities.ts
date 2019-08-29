import { AccountsBaseEntity } from "./entities/AccountsBaseEntity";
import { AccountsBaseUserOwnedEntity } from "./entities/AccountsBaseUserOwnedEntity";
import { AccountsBaseUser } from "./entities/AccountsBaseUser";
import { AccountsBaseUserEmail } from "./entities/AccountsBaseUserEmail";
import { AccountsBaseUserService } from "./entities/AccountsBaseUserService";
import { AccountsBaseUserSession } from "./entities/AccountsBaseUserSession";

export const BaseEntities = [
  AccountsBaseEntity,
  AccountsBaseUserOwnedEntity,
  AccountsBaseUser,
  AccountsBaseUserEmail,
  AccountsBaseUserService,
  AccountsBaseUserSession
];

export {
  AccountsBaseEntity,
  AccountsBaseUserOwnedEntity,
  AccountsBaseUser,
  AccountsBaseUserEmail,
  AccountsBaseUserService,
  AccountsBaseUserSession
};
