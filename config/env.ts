import dotenv from 'dotenv';

export enum Environment {
  Production = 'production',
  Development = 'development',
}

// Load environment
dotenv.config({
  path: './.env',
});

const poolConfig = {
  max: 100,
  min: 0,
  idle: 20000,
  acquire: 20000,
  evict: 30000,
  handleDisconnects: true,
};

const database = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'projectname',
  host: process.env.DB_HOST || 'localhost',
  pool: process.env.enableConnectionPool ? poolConfig : undefined,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === Environment.Development,
  port: parseInt(process.env.DB_PORT),
  timezone: '+00:00',
};

export default {
  appName: process.env.APP_NAME || 'ProjectName',
  /**
   * Application environment mode either development or production or test
   * @type {String}
   */
  environment: process.env.NODE_ENV || Environment.Development,

  /**
   * Database connection for each environment
   * @type {Object}
   */
  database,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '20d',
  jwtVerifyExpiresIn: '24h',
  jwtResetPasswordExpiresIn: '1h',

  salt: process.env.SALT || '10',

  /**
   * Mail server information
   * @type {Object}
   */
  mailServer: process.env.EMAIL_SERVER,
  mailPort: process.env.EMAIL_PORT,
  mailAuthUserName: process.env.EMAIL_AUTH_USERNAME,
  mailAuthPassword: process.env.EMAIL_AUTH_PASSWORD,
  senderEmail: process.env.SENDER_EMAIL,
  senderName: process.env.SENDER_NAME,
  sysAdminEmail: process.env.SYS_ADMIN_EMAIL,

  /**
   * Redis configuration
   * @type {Object}
   */
  redisUrl: process.env.REDIS_URL,

  /**
   * Client Url
   * @type {Object}
   */
  clientUrl: process.env.CLIENT_URL,

  /**
   * The folder storage record files
   * @type {Object}
   */
  assetsPath: process.env.ASSETS_PATH || 'assets/data',

  /**
   * The folder storage record files
   * @type {Object}
   */
  fileRootAvatar: process.env.FILE_ROOT_AVATAR,
};
