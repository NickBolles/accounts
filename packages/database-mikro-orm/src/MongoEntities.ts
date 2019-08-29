import { AccountsMongoUser } from "./entities/AccountsMongoUser";
import { AccountsMongoUserSession } from "./entities/AccountsMongoUserSession";
import { AccountsMongoUserEmail } from "./entities/AccountsMongoUserEmail";
import { AccountsMongoUserService } from "./entities/AccountsMongoUserService";

export const MongoEntities = {
  userEntity: AccountsMongoUser,
  sessionEntity: AccountsMongoUserSession,
  emailEntity: AccountsMongoUserEmail,
  serviceEntity: AccountsMongoUserService
};

export { AccountsMongoUser, AccountsMongoUserSession, AccountsMongoUserEmail, AccountsMongoUserService };
