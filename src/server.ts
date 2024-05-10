import App from './app';

import ScrapingRoute from './routes/scraping.route';
const app = new App([
     new ScrapingRoute()
]);

app.listen();
