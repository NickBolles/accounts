import { PrimaryKey, ManyToOne, Property, Entity } from "mikro-orm";
import { AccountsSQLUser } from "./AccountsSQLUser";
import { AccountsBaseUserService } from "./AccountsBaseUserService";
/**
 * SQL User Service
 */
@Entity({ collection: "user-service" })
export class AccountsSQLUserService extends AccountsBaseUserService {
  @PrimaryKey({ type: String })
  id!: string;

  @ManyToOne({ entity: () => AccountsSQLUser })
  user!: AccountsSQLUser;

  @Property({ type: String, nullable: true })
  userId!: string;
}
