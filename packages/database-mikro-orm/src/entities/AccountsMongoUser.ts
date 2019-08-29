import { Entity, PrimaryKey, OneToMany, Collection, Cascade } from "mikro-orm";
import { ObjectID } from "bson";
import { User } from "@accounts/types";
import { AccountsMongoUserSession } from "./AccountsMongoUserSession";
import { AccountsMongoUserEmail } from "./AccountsMongoUserEmail";
import { AccountsMongoUserService } from "./AccountsMongoUserService";
import { AccountsBaseUser } from "./AccountsBaseUser";
/**
 * MongoDB Accounts user
 */
@Entity({ collection: "user" })
export class AccountsMongoUser extends AccountsBaseUser implements User {
  @PrimaryKey({ type: ObjectID })
  _id!: ObjectID;
  id!: string;

  // todo: see if we can have this as a sub document? what about address uniqueness? both for user and system
  @OneToMany({
    fieldName: "emails",
    type: AccountsMongoUserEmail,
    entity: () => AccountsMongoUserEmail,
    mappedBy: "user",
    cascade: [Cascade.ALL]
  })
  allEmails = new Collection<AccountsMongoUserEmail>(this);

  @OneToMany({
    fieldName: "sessions",
    type: AccountsMongoUserSession,
    entity: () => AccountsMongoUserSession,
    mappedBy: "user",
    cascade: [Cascade.ALL]
  })
  allSessions = new Collection<AccountsMongoUserSession>(this);

  // todo: parse out services object
  @OneToMany({
    fieldName: "services",
    type: AccountsMongoUserService,
    entity: () => AccountsMongoUserService,
    mappedBy: "user",
    cascade: [Cascade.ALL]
  })
  allServices = new Collection<AccountsMongoUserService>(this);
}
