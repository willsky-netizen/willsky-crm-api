const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo(); // Load metadata

  return doc;
}

module.exports = accessSpreadsheet;
