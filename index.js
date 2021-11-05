const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');

const PORT = 8080;

const APP_ID = "9a33b308baca4124a700cb6cc0312c9f";
const APP_CERTIFICATE = "6f979a73b1cd45609d97e205febfdfaa";

const app = express();

const nocache = (req, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');
    const channelName = req.query.channelName;
    if(!channelName){
        return resp.status(500).json({'error': 'channel is required'});
    }
    let uid = req.query.uid;
    if(!uid || uis == ''){
        uid = 0;
    }

    let role = RtcRole.SUBSCRIBER;
    if(req.query.role == 'publisher'){
        role = RtcRole.PUBLISHER;
    }

    let expireTime = req.query.expireTime;
    if(!expireTime || expireTime == ''){
        expireTime = 3600;
    }else{
        expireTime = parseInt(expireTime, 10);
    }

    let currentTime = Math.floor(Date.now() / 1000);
    let privilegeExpiredTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTime);
    return resp.json({ 'token': token });
}

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});