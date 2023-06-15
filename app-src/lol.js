import { GoogleSpreadsheet } from 'google-spreadsheet'
import dotenv from 'dotenv'
dotenv.config()
// require('dotenv').config()

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID)

;(async () => {
    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    })

    await doc.loadInfo() // loads document properties and worksheets
    console.log(doc.title)
})().catch((e) => {
    console.log(e)
})
