const axios = require('axios');

/**
 * send text message to the given phone number
 * @param {String} to phone number of the receiver
 * @param {String} message message to be sent
 */
function sendText(to,message){
    axios.get('https://www.textit.biz/sendmsg?id=94770840267&pw=1724&to='+to+'&text='+message)
        .then(res => {})
        .catch(err => {});
}