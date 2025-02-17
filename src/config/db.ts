import dotenv from "dotenv";
import Firebird from "node-firebird";
import sql from "mssql";

dotenv.config();

const firebirdOptions: Firebird.Options = {
  host: process.env.FIREBIRD_HOST,
  port: Number(process.env.FIREBIRD_PORT),
  database: process.env.FIREBIRD_DATABASE,
  user: process.env.FIREBIRD_USER,
  password: process.env.FIREBIRD_PASSWORD,
  lowercase_keys: false,
  role: undefined,
  pageSize: 4096,
  retryConnectionInterval: 5000, 
};

class FirebirdDatabase {
  private static pool: ReturnType<typeof Firebird.pool>;

  private constructor() {}

  public static getPool(): ReturnType<typeof Firebird.pool> {
    if (!this.pool) {
      this.pool = Firebird.pool(5, firebirdOptions);
      console.log("🟢 Pool de conexões Firebird criado!");
    }
    return this.pool;
  }

  public static async getConnection(): Promise<Firebird.Database> {
    return new Promise((resolve, reject) => {
      FirebirdDatabase.getPool().get((err, db) => {
        if (err) {
          console.error("🔴 Erro ao conectar ao Firebird!", err);
          return reject(err);
        }
        resolve(db);
      });
    });
  }
}

export const firebirdConnect = FirebirdDatabase.getConnection;


//firebirdConnect(); Teste de conexãoca

// 🛢️ Conexão com SQL Server
const sqlServerConfig: sql.config = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER || "localhost",
  database: process.env.SQLSERVER_DATABASE,
  port: Number(process.env.SQLSERVER_PORT),
  options: {
    encrypt: process.env.SQLSERVER_ENCRYPT === "true",
    enableArithAbort: true,
  },
};

// Criando pool de conexões para SQL Server
export const poolPromise = new sql.ConnectionPool(sqlServerConfig)
  .connect()
  .then((pool) => {
    console.log("🟢 Conectado ao SQL Server!");
    return pool;
  })
  .catch((err) => {
    console.error("🔴 Erro ao conectar ao SQL Server:", err);
    throw err;
  });

export default sql;