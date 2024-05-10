import "dotenv/config";
import * as mongoose from "mongoose";

class DBService {
  public async initClientDbConnection(dbName: string) {
    const _global = global /* node */ as any;
    let taskdb = _global.clientConnection;
    taskdb = taskdb.useDb(dbName);
    return taskdb;
  }

  public async createClientDbConnection() {
    let database: mongoose.Connection;

    const clientOption = {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    };
    let connectionString =
      "mongodb+srv://atlasuser:SDf34fsf33ndff557fg@liveadluge.xoin0.mongodb.net/test?authSource=admin&replicaSet=atlas-vvo82z-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
    mongoose.connect(`${connectionString}`, { ...clientOption });
    database = mongoose.connection;
    database.once("open", async () => {
      console.log("Connected to database hureyy");
    });
    database.on("error", () => {
      console.log("Error connecting to database");
    });
    return database;
  }

  // public async initClientDbConnection(dbName: string) {
  //   let database: mongoose.Connection;

  //   const clientOption = {
  //     useCreateIndex: true,
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useFindAndModify: false,
  //   };
  //   let connectionString =
  //     "mongodb+srv://atlasuser:SDf34fsf33ndff557fg@liveadluge.xoin0.mongodb.net/<DBNAME>?authSource=admin&replicaSet=atlas-vvo82z-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
  //   let ss = connectionString.replace(/<DBNAME>/g, dbName);
  //   // mongoose.connect(`${ss}`, { ...clientOption })
  //   // database = mongoose.connection;
  //   database = mongoose.createConnection(`${ss}`, { ...clientOption });
  //   database.once("open", async () => {
  //     console.log("Connected to database hureyy");
  //   });
  //   database.on("error", () => {
  //     console.log("Error connecting to database");
  //   });
  //   return database;
  // }

  public async disconnect(dbName: string) {
    if (!dbName) {
      return;
    }
    mongoose.disconnect();
  }
}
export default DBService;
