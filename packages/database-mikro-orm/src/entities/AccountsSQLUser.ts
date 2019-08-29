import { Entity, PrimaryKey, OneToMany, Collection, Cascade } from "mikro-orm";
import { AccountsSQLUserSession } from "./AccountsSQLUserSession";
import { AccountsSQLUserEmail } from "./AccountsSQLUserEmail";
import { AccountsSQLUserService } from "./AccountsSQLUserService";
import { AccountsBaseUser } from "./AccountsBaseUser";
/**
 * SQL Accounts User
 */
@Entity({ collection: "user" })
export class AccountsSQLUser extends AccountsBaseUser {
  @PrimaryKey({ type: String })
  id!: string;

  @OneToMany({
    fieldName: "emails",
    type: AccountsSQLUserEmail,
    entity: () => AccountsSQLUserEmail,
    mappedBy: "user",
    cascade: [Cascade.ALL]
  })
  allEmails = new Collection<AccountsSQLUserEmail>(this);

  @OneToMany({
    fieldName: "session",
    type: AccountsSQLUserSession,
    entity: () => AccountsSQLUserSession,
    mappedBy: "user",
    cascade: [Cascade.ALL]
  })
  allSessions = new Collection<AccountsSQLUserSession>(this);

  // todo: parse out services object
  @OneToMany({
    fieldName: "services",
    type: AccountsSQLUserService,
    entity: () => AccountsSQLUserService,
    mappedBy: "user",
    cascade: [Cascade.ALL]
  })
  allServices = new Collection<AccountsSQLUserService>(this);
}
