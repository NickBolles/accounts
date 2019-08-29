import { PrimaryKey, ManyToOne, Property, Entity } from "mikro-orm";
import { ObjectID } from "mongodb";
import { AccountsMongoUser } from "./AccountsMongoUser";
import { AccountsBaseUserEmail } from "./AccountsBaseUserEmail";
/**
 * Mongodb Email
 */
@Entity({ collection: "user-email" })
export class AccountsMongoUserEmail extends AccountsBaseUserEmail {
  @PrimaryKey({ type: ObjectID })
  _id!: ObjectID;
  id!: string;

  @ManyToOne({ entity: () => AccountsMongoUser })
  user!: AccountsMongoUser;

  @Property({ type: ObjectID, nullable: true })
  userId?: ObjectID;
}
