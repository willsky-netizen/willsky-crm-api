const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: '"C:/Users/pooos/OneDrive/문서/PERSONAL PROJECT/willsky-crm-api-a08b5c5552a7.json"',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = auth;
