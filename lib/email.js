var config = require('config'),
    mailer = require('nodemailer'),
    transporter = mailer.createTransport({
        host: config.get('mandrill.host'),
        port: config.get('mandrill.port'),
        auth: {
            user: config.get('mandrill.user'),
            pass: config.get('mandrill.password')
        }
    }),
    Promise = require('bluebird'),
    sendMail = Promise.promisify(transporter.sendMail, transporter),
    request = Promise.promisifyAll(require('request'));

/**
 * Non-blocking function that sends an email.
 *
 * Check https://github.com/andris9/Nodemailer#e-mail-message-fields for the different options.
 *
 * @param options
 */
exports.send = function (options) {
    if (!options) {
        return;
    }

    sendMail(options).then(function() {
        // Do nothing.
    }).catch(function(err) {
        console.log('Error sending mail: ', err.stack);
    });
};

/**
 * Sending an example email
 *
 * @param name
 * @param email
 */
exports.sendExample = function(name, email) {
    if (!user) {
        return;
    }

    exports.send({
        from: 'The Example Team <hello@example.com>',
        to: name + ' <' + email + '>',
        subject: 'Welcome to Example!',
        html:   'Hey there,<br>' +
            '<p>Thank you for joining Example.  We\'re happy to have you!</p>' +
            '<p>We want you to love Example.  If you have any feedback, reply to this email and let us know.</p>' +
            '<p>Cheers,<br>The Example Team</p>'
    });
};