import { DatabaseInterface, CreateUser, User, ConnectionInformations, Session } from "@accounts/types";
import { EntityRepository, FindOptions, EntityManager, FilterQuery, FindOneOptions } from "mikro-orm";
import { MongoPlatform } from "mikro-orm/dist/platforms/MongoPlatform";
import { IPrimaryKey } from "mikro-orm/dist/decorators";
import debug from "debug";
import { isNumber, isPromise } from "./utils";
import { MongoEntities } from "./MongoEntities";
import { SQLEntities } from "./SQLEntities";
import {
  AccountsBaseUser,
  AccountsBaseUserSession,
  AccountsBaseUserEmail,
  AccountsBaseUserService
} from "./BaseEntities";

export type Logger = (formatter: string, ...args: any) => void;

export interface MikroORMDBOptions<UserType, SessionType, EmailType, ServiceType> {
  userEntity?: UserType;
  sessionEntity?: SessionType;
  emailEntity?: EmailType;
  serviceEntity?: ServiceType;
  entityManager: EntityManager;
  verbose?: boolean;
  logger?: Logger;
} // todo: use Pick/Omit to simplify

export interface MikroORMDBConfig<UserType, SessionType, EmailType, ServiceType> {
  userEntity: UserType;
  sessionEntity: SessionType;
  emailEntity: EmailType;
  serviceEntity: ServiceType;
  entityManager: EntityManager;
  verbose?: boolean;
}

enum Service {
  Password = "password",
  Reset = "password.reset",
  Verify = "email.verificationTokens"
}

const UserOwnedFindOpts = { populate: ["user", "user.allEmails", "user.allServices", "user.allSessions"] };

export class MikroORMDatabase<
  UserType extends { new (...args: any): AccountsBaseUser }, // = typeof MongoUser,
  SessionType extends { new (...args: any): AccountsBaseUserSession }, // = typeof MongoUserSession,
  EmailType extends { new (...args: any): AccountsBaseUserEmail }, // = typeof MongoUserEmail,
  ServiceType extends { new (...args: any): AccountsBaseUserService } // = typeof MongoUserService
> implements DatabaseInterface {
  private readonly User: UserType;
  private readonly users: EntityRepository<AccountsBaseUser>;
  private readonly Session: SessionType;
  private readonly sessions: EntityRepository<AccountsBaseUserSession>;
  private readonly Email: EmailType;
  private readonly emails: EntityRepository<AccountsBaseUserEmail>;
  private readonly Service: ServiceType;
  private readonly services: EntityRepository<AccountsBaseUserService>;
  private readonly options: MikroORMDBConfig<UserType, SessionType, EmailType, ServiceType>;

  private readonly em: EntityManager;

  private logger: Logger = debug("accounts:database-mikro-orm");

  constructor(options: MikroORMDBOptions<UserType, SessionType, EmailType, ServiceType>) {
    if (options.logger) {
      this.logger = options.logger;
    }

    this.em = options.entityManager;
    // todo: Figure out if this is the best way to check for mongo or not
    const platform = this.em.getDriver().getPlatform();
    if (platform instanceof MongoPlatform) {
      this.options = Object.assign({}, MongoEntities, options);
    } else {
      this.options = Object.assign({}, SQLEntities, options);
    }

    const { userEntity, sessionEntity, emailEntity, serviceEntity } = this.options;

    this.User = userEntity;
    this.users = new EntityRepository(this.em, this.User);
    this.Session = sessionEntity;
    this.sessions = new EntityRepository(this.em, this.Session);
    this.Email = emailEntity;
    this.emails = new EntityRepository(this.em, this.Email);
    this.Service = serviceEntity;
    this.services = new EntityRepository(this.em, this.Service);
  }

  log(formatter: string, ...args: any): void {
    this.logger(formatter, ...args);
  }

  verbose(formatter: string, ...args: any): void {
    if (this.options.verbose) {
      this.log(formatter, ...args);
    }
  }

  /**
   * Protected, overrideable methods
   */
  protected async findOneUserWhere(
    where: FilterQuery<UserType> | IPrimaryKey,
    options?: FindOptions
  ): Promise<AccountsBaseUser> {
    this.verbose("findOneUserWhere - where: %O", where);
    const users = await this.findUserWhere(where, options);
    this.verbose("findOneUserWhere - found: %O", users);
    if (users.length > 1) {
      throw new Error("More than one user found with criteria" + JSON.stringify(where));
    }
    return users[0];
  }

  protected async findUserWhere(
    where: FilterQuery<UserType> | IPrimaryKey,
    options: FindOptions = { populate: ["allEmails", "allSessions", "allServices"] }
  ): Promise<AccountsBaseUser[]> {
    // todo: add customizability? - This could be extended and overridden I guess

    this.log("findUserWhere - where: %o", where);
    try {
      const users = await this.users.find(where, options);
      this.verbose("findUserWhere - found: %O", users);
      return users;
    } catch (e) {
      this.log(e);
      throw e;
    }
  }

  protected buildUser(user: CreateUser): Promise<AccountsBaseUser> {
    this.log("buildUser from: %O", user);
    const { email, password, username, ...otherProps } = user;
    const newUser = new this.User();

    newUser.assign(otherProps);

    if (username) {
      newUser.username = username.toLocaleLowerCase();
    }

    if (email) {
      this.verbose("buildUser with email: %s", email);

      const emailRecord = new this.Email(email);
      this.verbose("buildUser emailRecord: %O", emailRecord);

      newUser.allEmails.add(emailRecord);
    }

    if (password) {
      this.verbose("buildUser - service with password: %s", password); // todo: don't log password

      const serviceRecord = new this.Service();

      serviceRecord.assign({
        name: Service.Password,
        options: {
          bcrypt: password
        }
      });
      this.verbose("buildUser with password: %s", password); // todo: don't log password

      newUser.allServices.add(serviceRecord);
    }
    return Promise.resolve(newUser); // make this Async to future proof it
  }

  /**
   * Transform the entity into a User for accountsjs.
   * The only need for this right now (I think...) is to convert the type to a User interface.
   * Instead of doing that in every call let's do it in a central location
   */
  protected async transformUser(
    userEntity: AccountsBaseUser | null | Promise<AccountsBaseUser | null>
  ): Promise<User | null> {
    if (isPromise(userEntity)) {
      this.verbose("transformUser - Waiting for Promise", userEntity);
    }
    const user = await userEntity;

    this.verbose("transformUser - %o", user);
    return user ? user.toJSON() : user;
  }

  private findServiceWhere(
    where: FilterQuery<AccountsBaseUserService> & IPrimaryKey,
    options: FindOptions = UserOwnedFindOpts
  ): Promise<AccountsBaseUserService[]> {
    this.verbose("findServiceWhere - where: %o", where);
    return this.services.find(where, options);
  }

  private async getService(
    userId?: string,
    name?: string,
    options?: FindOneOptions
  ): Promise<AccountsBaseUserService | null> {
    const where: FilterQuery<AccountsBaseUserService> & IPrimaryKey = { name };
    if (userId) {
      where.user = userId;
    }
    const services = await this.findServiceWhere(where, {
      limit: 1,
      ...options
    });

    return services[0];
  }

  private findSessionWhere(
    where: FilterQuery<AccountsBaseUserSession> & IPrimaryKey,
    options: FindOptions = UserOwnedFindOpts
  ): Promise<AccountsBaseUserSession[]> {
    return this.sessions.find(where, options);
  }

  private async findOneSessionWhere(
    where: FilterQuery<AccountsBaseUserSession> & IPrimaryKey,
    options?: FindOptions
  ): Promise<AccountsBaseUserSession> {
    this.log("findOneSessionWhere - where: %o", where);
    const sessions = await this.findSessionWhere(where, {
      limit: 1,
      ...options
    });
    this.verbose("findOneSessionWhere - found: %s", JSON.stringify(sessions));
    return sessions[0];
  }

  /**
   * Database Interface methods
   */
  async findUserByEmail(email: string): Promise<User | null> {
    this.log("findUserByEmail - email: %s", email);

    const emailRecord = await this.emails.findOne({ address: email.toLocaleLowerCase() }); // todo: populate user

    if (!emailRecord) {
      return null;
    }

    return this.transformUser(this.findOneUserWhere({ id: emailRecord.user }));
  }

  findUserByUsername(username: string): Promise<User | null> {
    this.log("findUserByUsername - username: %0", username);
    return this.transformUser(this.findOneUserWhere({ username: username.toLocaleLowerCase() }));
  }

  findUserById(userId: string): Promise<User | null> {
    this.log("findUserById - userId: %s", userId);
    return this.transformUser(this.findOneUserWhere({ id: userId }));
  }

  async createUser(user: CreateUser): Promise<string> {
    this.log("createUser - user: %0", user);
    try {
      const newUser = await this.buildUser(user);
      this.verbose("createUser - built User: %O", newUser);

      this.verbose("createUser - persist start");
      await this.users.persist(newUser);
      const id = newUser.id;
      this.verbose("createUser - persisting done - ID: %s", id);

      return isNumber(id) ? id.toString() : id;
    } catch (e) {
      this.log(e);
      throw e;
    }
  }

  async setUsername(userId: string, newUsername: string): Promise<void> {
    this.log("setUsername - userID: %s newUsername: %", userId, newUsername);

    const user = await this.findOneUserWhere({ id: userId });
    user.username = newUsername.toLocaleLowerCase(); // todo on lowercase on update?

    this.verbose("setUsername - persist start");
    await this.users.persist(user);
    this.verbose("setUsername - persist done");
  }

  /**
   * Service operations
   */
  async findUserByServiceId(serviceName: Service, serviceId: string): Promise<User | null> {
    this.log("findUserByServiceId - serviceName: %s serviceId: %s", serviceName, serviceId);
    const service = await this.services.findOne({ name: serviceName, id: serviceId }, UserOwnedFindOpts);
    this.verbose("findUserByServiceId - found %O", service);

    if (!service) {
      return null;
    }
    return this.transformUser(service.user);
  }

  async setService(userId: string, serviceName: Service, data: any, token?: string): Promise<void> {
    this.log("setService - userId: %s serviceName: %s data: %o token: %s", userId, serviceName, data, token);

    let service = await this.getService(userId, serviceName);

    if (!service) {
      this.verbose("setService - creating new service");
      service = new this.Service();
      service.name = serviceName;
    } else {
      this.verbose("setService - existing service: %O", service);
    }
    const { id = null, ...options } = data;

    service.assign({ serviceId: id, user: userId, userId, options, token });

    this.verbose("setService - persist start");
    await this.services.persist(service);
    this.verbose("setService - persist done");
    // todo: add service to user instead of creating service directly?
  }

  async unsetService(userId: string, serviceName: Service): Promise<void> {
    this.log("unsetService - userId: %s serviceName: %s data: %o token: %s", userId, serviceName);

    // todo: remove service to user instead of removing service directly?
    this.verbose("setService - remove start");
    const removed = await this.services.remove({
      user: userId,
      name: serviceName
    });
    this.verbose("setService - remove done - # removed: %d", removed);
  }

  async findPasswordHash(userId: string): Promise<string | null> {
    this.log("findPasswordHash - userId: %s", userId);

    const service = await this.getService(userId, Service.Password);
    this.verbose("findPasswordHash - service found? %s", !!service);

    if (!service) {
      return null;
    }
    return service.options.bcrypt;
  }

  async findUserByResetPasswordToken(token: string): Promise<User | null> {
    this.log("findUserByResetPasswordToken - token: %s", token);

    const service = await this.findServiceWhere(
      { name: Service.Reset, token },
      { ...UserOwnedFindOpts, orderBy: { createdAt: "DESC" } }
    );
    this.verbose("findUserByResetPasswordToken - service found?: %s", !!service);

    if (!service || service[0]) {
      return null;
    }
    return this.transformUser(service[0].user);
  }

  async setPassword(userId: string, newPassword: string): Promise<void> {
    this.log("setPassword - userId: %s password: %s", userId, newPassword); // todo: don't log password

    this.verbose("setPassword - set service");
    await this.setService(userId, Service.Password, { bcrypt: newPassword });
    this.verbose("setPassword - set service done");
  }

  addResetPasswordToken(userId: string, email: string, token: string, reason: string): Promise<void> {
    this.log("addResetPasswordToken - userId: %s email: %s reason %s", userId, email, reason);

    // todo: potentially remove other reset tokens here?
    return this.setService(
      userId,
      Service.Reset,
      { address: email.toLocaleLowerCase(), when: new Date().toJSON(), reason },
      token
    );
  }

  async setResetPassword(userId: string, email: string, newPassword: string, _?: string): Promise<void> {
    this.log("addResetPasswordToken - userId: %s email: %s reason %s", userId, email);

    // todo: make sure that Accounts validates the token for us before calling this
    await this.setPassword(userId, newPassword);
    await this.unsetService(userId, Service.Reset);
    this.verbose("addResetPasswordToken - done");
  }

  async findUserByEmailVerificationToken(token: string): Promise<User | null> {
    this.log("findUserByEmailVerificationToken - token: %s", token); // todo :don't log token

    const service = await this.findServiceWhere({ token, name: Service.Verify });
    this.verbose("findUserByEmailVerificationToken - service found?: %o", !!service);

    if (!service || !service[0]) return null;
    return this.transformUser(service[0].user);
  }

  async addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    this.log("addEmail - userId: %s newEmail: %s verified: %s", userId, newEmail, verified);

    const email = new this.Email(newEmail, verified);
    email.assign({ address: newEmail, verified, userId });

    this.verbose("addEmail - get user");
    const user = await this.findOneUserWhere({ id: userId });
    this.verbose("addEmail - get user done");

    user.allEmails.add(email);

    this.verbose("addEmail - persist start");
    await this.users.persist(user);
    this.verbose("addEmail - persist done");
  }

  async removeEmail(userId: string, address: string): Promise<void> {
    this.log("removeEmail userId %s address %s", userId, address);

    this.verbose("removeEmail - remove start");
    const removed = await this.emails.remove({ userId, address });
    this.verbose("removeEmail - remove done - # removed: ", removed);
  }

  async verifyEmail(userId: string, address: string): Promise<void> {
    this.log("verifyEmail userId: %s address: %s ", userId, address);

    const emails = await this.emails.find({ userId, address: address });
    this.verbose("verifyEmail - found email ", emails);

    if (!emails || !emails[0]) return;
    const email = emails[0];
    email.address = address;

    this.verbose("verifyEmail - persist start");
    await this.emails.persist(email);
    this.verbose("verifyEmail - persist done");
  }

  addEmailVerificationToken(userId: string, email: string, token: string): Promise<void> {
    this.log("addEmailVerificationToken - userId %s email %s", userId, email);
    return this.setService(userId, Service.Verify, { address: email.toLocaleLowerCase(), when: new Date() }, token);
  }
  async setUserDeactivated(userId: string, deactivated: boolean): Promise<void> {
    this.log("setUserDeactivated - userId %s deactivated %s", userId, deactivated);

    this.verbose("setUserDeactivated - find user start");
    const user = await this.findOneUserWhere({ id: userId });
    this.verbose("setUserDeactivated - find user done - found?: %s", !!user);

    if (!user) return;
    user.deactivated = deactivated;

    this.verbose("setUserDeactivated - persist start");
    await this.users.persist(user);
    this.verbose("setUserDeactivated - persist done");
  }

  findSessionById(sessionId: string): Promise<Session> {
    this.log("findSessionById - sessionId: %s", sessionId);

    return (this.findOneSessionWhere({ id: sessionId }) as any) as Promise<Session>; // todo: get rid of typecast
  }

  async findSessionByToken(token: string): Promise<Session> {
    this.log("findSessionByToken - token: %s", token);

    return ((await this.findOneSessionWhere({ token })) as any) as Session; // todo: get rid of typecast
  }

  async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations,
    extra?: object
  ): Promise<string> {
    this.log("createSession - userId: %s", userId);

    const session = new this.Session();
    session.assign({
      userId,
      token,
      userAgent: connection.userAgent,
      ip: connection.ip,
      valid: true,
      user: userId,
      extra
    });

    this.verbose("createSession - persist start");
    await this.sessions.persist(session);
    const id = session.id;

    this.verbose("createSession - persist done - id:", id);
    return isNumber(id) ? id.toString() : id;
  }

  async updateSession(sessionId: string, connection: ConnectionInformations): Promise<void> {
    this.log("updateSession - sessionId: %s", sessionId);

    this.verbose("updateSession - find start");
    const session = await this.findOneSessionWhere({ id: sessionId });
    this.verbose("updateSession - find done - found?", !!session);

    if (!session) return;
    session.userAgent = connection.userAgent;
    session.ip = connection.ip;

    this.verbose("updateSession - persist start");
    await this.sessions.persist(session);
    this.verbose("updateSession - persist done");
  }

  async invalidateSession(sessionId: string): Promise<void> {
    this.log("invalidateSession - sessionId: %s", sessionId);

    this.verbose("invalidateSession - find start");
    const session = await this.findOneSessionWhere({ id: sessionId });
    this.verbose("invalidateSession - find done");

    if (!session) return;
    session.valid = false;

    this.verbose("invalidateSession - persist start");
    await this.sessions.persist(session);
    this.verbose("invalidateSession - persist done");
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    this.log("invalidateAllSessions - userId: %s", userId);

    this.verbose("invalidateAllSessions - update start");
    const updated = await this.sessions.nativeUpdate({ userId }, { valid: false }); // todo: get rid of this any
    this.verbose("invalidateAllSessions - update done - # upated %s", updated);
  }
}
