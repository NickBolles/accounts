import { PrimaryKey, ManyToOne, Entity, Property } from "mikro-orm";
import { ObjectID } from "mongodb";
import { AccountsMongoUser } from "./AccountsMongoUser";
import { AccountsBaseUserSession } from "./AccountsBaseUserSession";
/**
 * Mongo Session
 */
@Entity({ collection: "user-session" })
export class AccountsMongoUserSession extends AccountsBaseUserSession {
  @PrimaryKey({ type: ObjectID })
  _id!: ObjectID;
  id!: string;

  @ManyToOne({ entity: () => AccountsMongoUser })
  user!: AccountsMongoUser;

  @Property({ type: ObjectID, nullable: true })
  userId!: ObjectID;
}
