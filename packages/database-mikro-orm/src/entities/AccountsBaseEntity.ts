import { IEntity } from "mikro-orm";

export interface AccountsBaseEntityJSON {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export abstract class AccountsBaseEntity {
  abstract id: string;

  // Properties can't be defined at this level because Mikro-ORM only searches the first level of prototype
  // @Property({ type: Date })
  abstract createdAt: Date = new Date();

  // @Property({ type: Date, onUpdate: () => new Date() })
  abstract updatedAt: Date = new Date();

  toJSON(): AccountsBaseEntityJSON {
    const result = this.toObject ? this.toObject() : this; // Getting an this.toObject is not a function in insertOne#mongoconnection.js

    if (this.updatedAt) {
      result.updatedAt = this.updatedAt.toISOString();
    }
    if (this.createdAt) {
      result.createdAt = this.createdAt.toISOString();
    }
    return result as any;
  }
}
/* eslint @typescript-eslint/no-empty-interface: "off" */
export interface AccountsBaseEntity extends IEntity {}
