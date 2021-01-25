const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "187042784096-npj4khs2vuamrgch4odu4fmoboiv8f7v.apps.googleusercontent.com";

module.exports = function(req, res, next) {
    const token = req.body.token;
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        console.log(payload);
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
    verify().then(function() {
        console.log("Verified!");
        next();
    })
}