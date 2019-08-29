import { PrimaryKey, ManyToOne, Property, Entity } from "mikro-orm";
import { ObjectID } from "mongodb";
import { AccountsMongoUser } from "./AccountsMongoUser";
import { AccountsBaseUserService } from "./AccountsBaseUserService";
/**
 * Mongodb Service
 */
@Entity({ collection: "user-service" })
export class AccountsMongoUserService extends AccountsBaseUserService {
  @PrimaryKey({ type: ObjectID })
  _id!: ObjectID;
  id!: string;

  @ManyToOne({ entity: () => AccountsMongoUser })
  user!: AccountsMongoUser;

  @Property({ type: ObjectID, nullable: true })
  userId!: ObjectID;
}
