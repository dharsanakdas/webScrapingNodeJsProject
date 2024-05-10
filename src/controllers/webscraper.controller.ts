import ScapeFunctions from "../services/scape.services";

import puppeteer from "puppeteer";
const { load } = require('cheerio');




class ScraperController {

    public scrapeFunctions = new ScapeFunctions()


    public getWebsiteData = async () => {

        let agencyList = await this.scrapeFunctions.getAgencies()
        console.log(typeof agencyList);

        for (let keys in agencyList) {

            console.log(keys);

            let each_agency: any = agencyList[keys];
            let agency_name = each_agency.agency_name;
            console.log(agency_name);
            let clientData = each_agency.companies;
            // console.log(clientData);

            let i = 0;
            let clientCount = 10;
            for (let companies in clientData) {

                let eachCompanyUrl = clientData[companies].website
                console.log(eachCompanyUrl)

                // eachCompanyUrl = "heierart.com";

                let url: any = "http://" + eachCompanyUrl
                // let url = "https://gofishdigital.com/"
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ["--no-sandbox"]

                });


                // Open a new page
                let page: any = await browser.newPage();

                try {
                    await page.goto(url, {
                        waitUntil: "load",
                        timeout: 0
                    })

                    // let response =  page.on('response', response => response);
                    let bodyHandle: any = await page.$('body') ? await page.$('body') : {};



                    if (bodyHandle) {
                        let html = await page.evaluate((body: any) => body.innerHTML, bodyHandle);
                        const $: any = load(html);


                        let listItems: any = $("a");
                        let links: any = []
                        const socials: any = {};

                        // console.log(listItems);
                        if (listItems) {
                            listItems.each((idx: any, el: any) => {

                                if (($(el).attr('href')) != undefined) {
                                    if (($(el).attr('href')).indexOf("facebook") !== -1) {

                                        // country["name"] = "facebook"
                                        socials["facebook"] = $(el).attr('href');
                                        // links.push(country);

                                    }
                                    else if (($(el).attr('href')).indexOf("linkedin") !== -1) {
                                        // country["name"] = "linkedin"
                                        socials["linkedin"] = $(el).attr('href');
                                        // links.push(country);

                                    }
                                    else if (($(el).attr('href')).indexOf("twitter") !== -1) {
                                        // country["name"] = "twitter"
                                        socials["twitter"] = $(el).attr('href');
                                    }
                                    else if (($(el).attr('href')).indexOf("instagram") !== -1) {
                                        // country["name"] = "twitter"
                                        socials["instagram"] = $(el).attr('href');
                                    }
                                }

                            });
                        }
                        // Logs countries array to the console
                        console.dir(socials);
                        // console.log(html)

                        let condition = { website: eachCompanyUrl }
                        let updateSocialMedia = await this.scrapeFunctions.updateAgencyCompanyData(socials, eachCompanyUrl, agency_name);


                        await bodyHandle.dispose();



                    }
                    await browser.close();
                }
                catch {
                    page.on('error', (error: any) => {
                        console.log('Error in page context:', error);
                    });

                }

            }

            let updateCronStatus = await this.scrapeFunctions.updateCronStatus(agency_name);

        }


    }
}

export default ScraperController;
