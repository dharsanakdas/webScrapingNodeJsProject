import DBService from "../config/dbConnections";
import { Schema, Mongoose } from "mongoose";
const axios = require("axios");
import CompanyDataModel from '../models/companyData.model'

class ScapeFunctions {
    public DBService = new DBService();
    public companyDataModel: Schema = (CompanyDataModel as unknown) as Schema;

    public async getAgencies(): Promise<any> {
        try {
            console.log("now in the service page");
            // const vpgID: string = auth.user_id ? auth.user_id : "";
            // const profileID: string = auth.profile_id ? auth.profile_id : "";    

            const dbName: string = "digital_marketing_agencies";
            const scrapingCollection: string = "companydata";
            let leadDB = await this.DBService.initClientDbConnection(dbName);
            const model = leadDB.model(scrapingCollection, this.companyDataModel, scrapingCollection);

            let result: any = await model.find({ status: 'Y', last_run_on: { $exists: false } }).lean().limit(5);
            return result;

        } catch (error) {
            return error;
        }
    }

    public async updateAgencyCompanyData(updateData: any, website: any, agency_name: any): Promise<any> {
        try {
            console.log("now in the service page");
            const dbName: string = "digital_marketing_agencies";
            const scrapingCollection: string = "companydata";
            let leadDB = await this.DBService.initClientDbConnection(dbName);
            const model = leadDB.model(scrapingCollection, this.companyDataModel, scrapingCollection);

            await model.findOneAndUpdate(
                // { _id: new ObjectId(id), 'companies.website': website },
                { agency_name: agency_name },
                // {
                //     '$set': {
                //         'companies.socials': updateData
                //     }
                // },
                // { new: true }
                // {
                //     upsert: true
                // }
                //{ "companies.$[el].website": website },
                { $set: { "companies.$[el].socials": updateData, "companies.$[el].cron_status": "Y" } },
                {
                    arrayFilters: [{ "el.website": website }],
                    new: true,
                    upsert: true
                }
            ).then((res: any) => {
                console.log(res)
            }).catch((err: any) => {
                console.log(err)
            });



        } catch (error) {
            return error;
        }

    }

    public async updateCronStatus(agency_name: any): Promise<any> {
        console.log("now in the service page");
        const dbName: string = "digital_marketing_agencies";
        const scrapingCollection: string = "companydata";
        let leadDB = await this.DBService.initClientDbConnection(dbName);
        const model = leadDB.model(scrapingCollection, this.companyDataModel, scrapingCollection);

        // let timeNow = moment()
        let last_run_on = new Date().getTime()
        console.log(last_run_on)
        await model.findOneAndUpdate(
            { agency_name: agency_name },
            { $set: { "last_run_on": last_run_on } },
            {
                new: true,
                upsert: true,
                useFindAndModify: false
            }).then((res: any) => {
                // console.log(res)
            }).catch((err: any) => {
                console.log(err)
            });

    }
}

export default ScapeFunctions;