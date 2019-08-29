import { PrimaryKey, ManyToOne, Property, Entity } from "mikro-orm";
import { AccountsSQLUser } from "./AccountsSQLUser";
import { AccountsBaseUserEmail } from "./AccountsBaseUserEmail";
/**
 * SQL User Email
 */
@Entity({ collection: "user-email" })
export class AccountsSQLUserEmail extends AccountsBaseUserEmail {
  @PrimaryKey({ type: String })
  id!: string;

  @ManyToOne({ entity: () => AccountsSQLUser })
  user!: AccountsSQLUser;

  @Property({ type: String, nullable: true })
  userId?: string;
}
