import { Property } from "mikro-orm";
import { AccountsBaseUserOwnedEntity } from "./AccountsBaseUserOwnedEntity";

type Options = { bcrypt: string } | any;

/**
 * Base User Service entity. Contains shared functionality between all drivers.
 */
export abstract class AccountsBaseUserService extends AccountsBaseUserOwnedEntity {
  // constructor(name?: string, options?: Options) {
  //   super();
  //   this.name = name;
  //   this.options = options;
  // }
  @Property({ type: Date })
  createdAt: Date = new Date();

  @Property({ type: Date, onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: String })
  name!: string;

  @Property({ type: String, nullable: true })
  token?: string;

  @Property({ type: String, nullable: true })
  serviceId!: string;

  @Property({ type: Object, nullable: true })
  options: Options;
}
