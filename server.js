const express = require('express');
var app = express();
const bodyParser = require('body-parser');
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
const path = require('path');

app.use(bodyParser.json());

//EXPL: single in memory user
let user = {
    'firstName': "Demo",
    'lastName': "1",
    email: "demo@gmail.com",
    password: "test"
}

//login API supports both, normal auth + 2fa
app.post('/login', function(req, res){
    if(!user.twofactor || !user.twofactor.secret){ //two factor is not enabled by the user
        //check credentials
		if(req.body.email == user.email && req.body.password == user.password){
            return res.send('success');
        }
        return res.status(400).send('Invald email or password');
    } else {
        //two factor enabled
        if(req.body.email != user.email || req.body.password != user.password){
            return res.status(400).send('Invald email or password');
        }
		//check if otp is passed, if not then ask for OTP
        if(!req.headers['x-otp']){
            return res.status(206).send('Please enter otp to continue');
        }
        //validate otp
        var verified = speakeasy.totp.verify({
            secret: user.twofactor.secret,
            encoding: 'base32',
            token: req.headers['x-otp']
        });
        if(verified){
            return res.send('success');
        } else {
            return res.status(400).send('Invalid OTP');
        }
    }
});

//setup two factor for logged in user
app.post('/twofactor/setup', function(req, res){
    const secret = speakeasy.generateSecret({length: 10});
    // console.log("secerat", JSON.stringify(secret));
    var url =speakeasy.otpauthURL({
        secret: secret.ascii,
        label: "demo@gmail.com",
        issuer: "Demo"
      });
    QRCode.toDataURL(url, (err, data_url)=>{
        //save to logged in user.
        user.twofactor = {
            secret: "",
            tempSecret: secret.base32,
            dataURL: data_url,
            otpURL: secret.otpauth_url
        };
        return res.json({
            message: 'Verify OTP',
            tempSecret: secret.base32,
            dataURL: data_url,
            otpURL: secret.otpauth_url
        });
    });
});

//get 2fa details
app.get('/twofactor/setup', function(req, res){
    res.json(user.twofactor);
});

//disable 2fa
app.delete('/twofactor/setup', function(req, res){
    delete user.twofactor;
    res.send('success');
});

//before enabling totp based 2fa; it's important to verify, so that we don't end up locking the user.
app.post('/twofactor/verify', function(req, res){
    var verified = speakeasy.totp.verify({
        secret: user.twofactor.tempSecret, //secret of the logged in user
        encoding: 'base32',
        token: req.body.token
    });
    if(verified){
        user.twofactor.secret = user.twofactor.tempSecret;
        return res.send('Two-factor auth enabled');
    }
    return res.status(400).send('Invalid token, verification failed');
});
app.use(express.static(path.join(__dirname, 'build')));

//EXPL: Front-end app
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen('4000', ()=>{
    console.log('App running on 4000');
});