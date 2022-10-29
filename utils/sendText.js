const axios = require('axios');

/**
 * send text message to the given phone number
 * @param {String} to phone number of the receiver
 * @param {String} message message to be sent
 */
function sendText(to,message){
    const permission = true;
    if(permission){
        axios.get('https://www.textit.biz/sendmsg?id=94727709787&pw=1963&to='+to+'&text='+message)
        .then(res => {})
        .catch(err => {});
    }
}

module.exports = { sendText };