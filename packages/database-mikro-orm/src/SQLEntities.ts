import { AccountsSQLUser } from "./entities/AccountsSQLUser";
import { AccountsSQLUserSession } from "./entities/AccountsSQLUserSession";
import { AccountsSQLUserEmail } from "./entities/AccountsSQLUserEmail";
import { AccountsSQLUserService } from "./entities/AccountsSQLUserService";

export const SQLEntities = {
  userEntity: AccountsSQLUser,
  sessionEntity: AccountsSQLUserSession,
  emailEntity: AccountsSQLUserEmail,
  serviceEntity: AccountsSQLUserService
};

export { AccountsSQLUser, AccountsSQLUserSession, AccountsSQLUserEmail, AccountsSQLUserService };
