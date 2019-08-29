import { Property, Collection } from "mikro-orm";
import { User as AccountsUser, EmailRecord, User } from "@accounts/types";
import { AccountsBaseUserSession } from "./AccountsBaseUserSession";
import { AccountsBaseUserEmail } from "./AccountsBaseUserEmail";
import { AccountsBaseUserService } from "./AccountsBaseUserService";
import { AccountsBaseEntity, AccountsBaseEntityJSON } from "./AccountsBaseEntity";
const get = require("lodash.get");
const set = require("lodash.set");

/**
 * Base user entity, shared functionality between all drivers
 */
export abstract class AccountsBaseUser extends AccountsBaseEntity implements AccountsUser {
  // #region Abstract properties
  abstract allEmails: Collection<AccountsBaseUserEmail>;
  abstract allServices: Collection<AccountsBaseUserService>;
  abstract allSessions: Collection<AccountsBaseUserSession>;
  // #endregion

  @Property({ type: Date })
  createdAt: Date = new Date();

  @Property({ type: Date, onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: String, nullable: true }) // todo: in v3 of mikro-orm set to lowercase
  username?: string;

  @Property({ type: Boolean })
  deactivated: boolean = false;

  // #region Virtual properties to satisfy AccountsUser interface

  /**
   * Getter to transform services into a map
   */
  get services(): Record<string, any> {
    if (!this.allServices || !this.allServices.isInitialized() || !this.allServices.length) {
      return {};
    }
    return this.allServices.toArray().reduce((acc, { name, token, options }) => {
      const curVal = get(acc, name, []);
      const extra = token ? { token, ...options } : { ...options };
      set(acc, name, [...curVal, extra]);
      return acc;
    }, {});
  }
  set services(_: Record<string, any>) {
    // throw new Error("Cannot set services property directly"); // todo: should we actually throw here? //todo: remove in v3 of mikro-orm
  }

  get emails(): EmailRecord[] {
    if (!this.allEmails || !this.allEmails.isInitialized() || !this.allEmails.length) {
      return [];
    }
    return this.allEmails.toArray() as EmailRecord[];
  }
  set emails(_: EmailRecord[]) {
    // throw new Error("Cannot set emails property directly"); // todo: should we actually throw here? //todo: remove in v3 of mikro-orm
  }
  // #endregion

  toJSON(strict = true, strip = ["allEmails", "allServices"], ...args: any[]): User & AccountsBaseEntityJSON {
    // todo: look at this again in v3 of mikro-orm, why is toObject not defined sometimes?
    const result = super.toJSON();

    Object.assign(result, {
      emails: (result as any).allEmails || [],
      services: this.services
    });

    strip.forEach(p => delete (result as any)[p]);

    return result as any;
  }
}
