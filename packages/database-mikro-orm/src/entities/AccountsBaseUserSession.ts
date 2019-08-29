import { Property } from "mikro-orm";
import { AccountsBaseUserOwnedEntity } from "./AccountsBaseUserOwnedEntity";

/**
 * Base User session entity. Contains shared functionality between all drivers for user sessions.
 */
export abstract class AccountsBaseUserSession extends AccountsBaseUserOwnedEntity {
  @Property({ type: Date })
  createdAt: Date = new Date();

  @Property({ type: Date, onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: String })
  token!: string;

  @Property({ type: Boolean })
  valid!: boolean;

  @Property({ type: String, nullable: true })
  userAgent?: string;

  @Property({ type: String, nullable: true })
  ip?: string;

  // todo: confirm that this works for both mongodb and sql
  @Property({ type: Object, nullable: true })
  extra?: object;
}
