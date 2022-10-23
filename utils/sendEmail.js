// sending blue api 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

const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = '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';
const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
    email: 'dilshansankalpa98@gmail.com',
    name: 'Admin - Agri-2-Go',
}

/**
 * 
 * send email to the given email address
 * 
 * @param {String} to email address of the receiver 
 * @param {*} subject subject of the email
 * @param {*} message html content of the email
 */
function sendEmail(to,subject,message){
    const receivers = [
        {
            email: to,
        },
    ]
    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: subject,
        htmlContent: message
    })
    .then(console.log)
    .catch(console.log)
}

module.exports = { sendEmail };