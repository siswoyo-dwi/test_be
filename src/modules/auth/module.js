import microsoftAuth from "../../auth/microsoft.js"
import googleAuth from "../../auth/google.js"
import appleAuth from "../../auth/apple.js"


const msAuth = microsoftAuth.authenticate('microsoft', {
    // Optionally define any authentication parameters here
    // For example, the ones in https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
    session:false,
    prompt: 'select_account',
  })

  const msAuthCb=microsoftAuth.authenticate('microsoft', { failureRedirect: '/', session:false, })

  const redirect = function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }

  const gAuth = googleAuth.authenticate('google', { scope: ['profile'], session:false })

  const gAuthCb=googleAuth.authenticate('google', { failureRedirect: '/', session:false, })

  const gRedirect = function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }


  const aAuth = appleAuth.authenticate('apple', {  session:false })

  const aAuthCb=appleAuth.authenticate('apple', { failureRedirect: '/', session:false, })

  const aRedirect = function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
  

export  {msAuth, msAuthCb, redirect, gAuth,gAuthCb,gRedirect, aAuth, aAuthCb, aRedirect}