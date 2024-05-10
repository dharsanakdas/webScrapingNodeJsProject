import * as mongoose from 'mongoose';

const companyDataSchema = new mongoose.Schema({
  _id: String,
  agency_name: String,
  companies: Object,
  website: String,
  socials: Object,
  last_run_on: String
},
  { timestamps: false });

export default companyDataSchema;    