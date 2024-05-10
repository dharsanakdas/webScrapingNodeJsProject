import * as dotenv from "dotenv";
import * as cors from "cors";
import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import Routes from "./interfaces/routes.interface";
//import { notFoundHandler } from "./middleware/notFound.middleware";
import * as cron from "node-cron";
import DBService from "./config/dbConnections";
import ScrapController from "./controllers/webscraper.controller";

dotenv.config();

class App {
  public app: express.Application;
  public port: string | number;
  public env: boolean;
  public dbService = new DBService();

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3040;
    this.env = process.env.NODE_ENV === "production" ? true : false;
    // cron.schedule('*/3 * * * *', function () {
    //   console.log('running a task every minute');
    //   logController.summaryGenerate()
    // });
    this.connectToDatabase();
    this.initializeCron();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    //Added for avoid memory leak
    require("events").EventEmitter.defaultMaxListeners = Infinity;
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    //here we assign connection object to the global js object
    const _global = global /* node */ as any;
    _global.clientConnection = await this.dbService.createClientDbConnection();
  }

  private initializeMiddlewares() {
    if (this.env) {
      // this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else {
      this.app.use(logger("dev"));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }


  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

 

  private initializeCron() {  
   
    cron.schedule("*/10 * * * *", () => {
      console.log("Web scrapping is running for taking social media links")
      const scrapController = new ScrapController();
      scrapController.getWebsiteData();
    });
  }



}

export default App;
