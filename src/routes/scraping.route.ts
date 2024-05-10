import { Router } from 'express';
import ScraperController from '../controllers/webscraper.controller';
import Route from '../interfaces/routes.interface';

class ScrapingRoute implements Route {
  public path = '/screaping';
  public router = Router();
  public scraperController = new ScraperController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/get-website-data`, this.scraperController.getWebsiteData);
    
  }
}

export default ScrapingRoute;
