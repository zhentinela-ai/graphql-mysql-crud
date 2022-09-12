import { DataSource } from "typeorm";
import { Users } from "./Entities/Users";

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "./config";

export const dataSource = new DataSource({
  type: "mysql",
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
  host: DB_HOST,
  database: DB_NAME,
  entities: [Users],
  synchronize: true,
  ssl: false,
});

export const connectDB = async () => {
  const connect = await dataSource.initialize();
  console.log(`Database: ${connect.options.database}, is connected`);
  return connect;
};
