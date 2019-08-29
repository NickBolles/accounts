import { ObjectID } from "mongodb";
import { AccountsBaseEntity } from "./AccountsBaseEntity";
import { AccountsBaseUser } from "./AccountsBaseUser";

export abstract class AccountsBaseUserOwnedEntity extends AccountsBaseEntity {
  abstract user: AccountsBaseUser;
  abstract userId?: ObjectID | string | number;
}
