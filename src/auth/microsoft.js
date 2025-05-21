import passport from 'passport'
import {Strategy as MicrosoftStrategy} from 'passport-microsoft'

passport.use(new MicrosoftStrategy({
  // Standard OAuth2 options
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_SECRET,
  callbackURL: process.env.MICROSOFT_CALLBACK_URL,
  scope: ['user.read'],

  // Microsoft specific options

  // [Optional] The tenant ID for the application. Defaults to 'common'. 
  // Used to construct the authorizationURL and tokenURL
  tenant: process.env.MICROSOFT_TENANT_ID,

  // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
  authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

  // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
  tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',

  // [Optional] The Microsoft Graph API version (e.g., 'v1.0', 'beta'). Defaults to 'v1.0'.
  graphApiVersion: 'v1.0',

  // [Optional] If true, will push the User Principal Name into the `emails` array in the Passport.js profile. Defaults to false.
  addUPNAsEmail: false,
  
  // [Optional] The Microsoft Graph API Entry Point, defaults to https://graph.microsoft.com. Configure this if you are using Azure China or other regional version.
  apiEntryPoint: 'https://graph.microsoft.com',
},
function(accessToken, refreshToken, profile, done) {
console.log(profile);
done(null, profile)

}
));

export default passport;