import { PrimaryKey, ManyToOne, Entity, Property } from "mikro-orm";
import { AccountsSQLUser } from "./AccountsSQLUser";
import { AccountsBaseUserSession } from "./AccountsBaseUserSession";
/**
 * SQL User session
 */
@Entity({ collection: "user-session" })
export class AccountsSQLUserSession extends AccountsBaseUserSession {
  @PrimaryKey({ type: String })
  id!: string;

  @ManyToOne({ entity: () => AccountsSQLUser })
  user!: AccountsSQLUser;

  @Property({ type: String, nullable: true })
  userId!: string;
}
