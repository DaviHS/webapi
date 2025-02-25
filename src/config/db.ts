import sql from "mssql";
import dotenv from "dotenv";
import Firebird from "node-firebird";

dotenv.config();

const firebirdOptions: Firebird.Options = {
  host: process.env.FB_ACESSO_HOST,
  port: Number(process.env.FB_ACESSO_PORT),
  database: process.env.FB_ACESSO_DATABASE,
  user: process.env.FB_ACESSO_USER,
  password: process.env.FB_ACESSO_PASSWORD,
  lowercase_keys: false,
  role: undefined,
  pageSize: 4096,
  retryConnectionInterval: 5000,
};

class FirebirdDatabase {
  private static pool: ReturnType<typeof Firebird.pool>;
  private static activeConnections = 0;

  private constructor() {}

  public static getPool(): ReturnType<typeof Firebird.pool> {
    if (!FirebirdDatabase.pool) {
      FirebirdDatabase.pool = Firebird.pool(5, firebirdOptions);
      console.log("🟢 Pool de conexões Firebird criado!");
    }
    return FirebirdDatabase.pool;
  }

  private static async reconnect() {
    console.log("🔄 Tentando reconectar ao Firebird...");
    await new Promise((resolve) => setTimeout(resolve, firebirdOptions.retryConnectionInterval));

    try {
      const db = await FirebirdDatabase.getConnection();
      console.log("🟢 Reconexão bem-sucedida!");
      return db;
    } catch (err) {
      console.error("❌ Falha na reconexão ao Firebird:", err);
      return null;
    }
  }

  public static async getConnection(): Promise<Firebird.Database> {
    return new Promise((resolve, reject) => {
      const pool = FirebirdDatabase.getPool();

      pool.get((err, db) => {
        if (err) {
          console.error("🔴 Erro ao conectar ao Firebird:", err);

          if (err.code === "ECONNRESET") {
            console.warn("🔄 Tentando reconectar ao Firebird após falha...");
            FirebirdDatabase.reconnect()
              .then((db) => {
                if (db) {
                  resolve(db);
                } else {
                  reject(new Error("Falha ao reconectar ao Firebird."));
                }
              })
            .catch(reject);
          }

          return reject(err);
        }

        FirebirdDatabase.activeConnections++;
        console.log(`✅ Conexão obtida. Conexões ativas: ${FirebirdDatabase.activeConnections}`);

        resolve(db);
      });
    });
  }

  public static releaseConnection(db: Firebird.Database | null) {
    if (!db) return;
    
    try {
      db.detach();
      this.activeConnections = Math.max(0, this.activeConnections - 1);
      console.log(`ℹ️ Conexão liberada. Conexões ativas: ${this.activeConnections}`);
    } catch (err) {
      console.error("⚠️ Erro ao liberar a conexão Firebird:", err);
    }
  }
}

export const firebirdConnect = FirebirdDatabase.getConnection;


const sqlServerConfig: sql.config = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER || "localhost",
  database: process.env.SQLSERVER_DATABASE,
  port: Number(process.env.SQLSERVER_PORT) || 1433,
  options: {
    encrypt: true, 
    trustServerCertificate: false,
    enableArithAbort: true,
  },
};

let sqlPool: sql.ConnectionPool | null = null;


export async function getSqlConnection(): Promise<sql.ConnectionPool> {
  if (sqlPool && sqlPool.connected) {
    return sqlPool;
  }

  console.log("🔄 Criando nova conexão com SQL Server...");

  try {
    sqlPool = await sql.connect(sqlServerConfig);

    sqlPool.on("error", async (err) => {
      console.error("🔥 Erro na conexão com SQL Server:", err);

      if (sqlPool) {
        sqlPool.close();
        sqlPool = null; 
      }

      console.log("🔄 Tentando reconectar ao SQL Server...");
      await reconnectSqlServer();
    });

    console.log("🟢 Conectado ao SQL Server com segurança!");
    return sqlPool;

  } catch (err) {
    console.error("❌ Falha ao conectar ao SQL Server:", err);
    throw new Error("Erro ao conectar ao banco de dados.");
  }
}

async function reconnectSqlServer() {
  let attempts = 0;
  const maxRetries = 5;

  while (attempts < maxRetries) {
    try {
      attempts += 1;
      console.log(`🔄 Tentativa ${attempts} de reconexão ao SQL Server...`);
      sqlPool = await sql.connect(sqlServerConfig); 
      console.log("🟢 Reconexão bem-sucedida!");
      return;
    } catch (err) {
      console.error("❌ Erro ao tentar reconectar:", err);
      if (attempts < maxRetries) {
        console.log("⏳ Aguardando 5 segundos antes da próxima tentativa...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        throw new Error("Erro ao reconectar ao banco de dados após várias tentativas.");
      }
    }
  }
}