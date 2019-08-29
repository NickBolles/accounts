import { Property } from "mikro-orm";
import { EmailRecord } from "@accounts/types";
import { AccountsBaseUserOwnedEntity } from "./AccountsBaseUserOwnedEntity";

/**
 * Base User Email entity. Contains shared functionality between all drivers.
 */
export abstract class AccountsBaseUserEmail extends AccountsBaseUserOwnedEntity implements EmailRecord {
  constructor(address: string, verified: boolean = false) {
    super();
    this.address = address;
    this.verified = verified;
  }

  @Property({ type: Date })
  createdAt: Date = new Date();

  @Property({ type: Date, onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: String, unique: true })
  address: string;

  @Property({ type: Boolean, default: false })
  verified: boolean = false;
}
