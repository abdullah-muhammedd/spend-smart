const ejs = require( "ejs" );
const fs = require( "fs" );
const path = require( "path" );
const nodemailer = require( "nodemailer" );
require( 'dotenv' ).config();

/**
 * @description Create the mailing transporter using nodemailer 
 */

const transporter = nodemailer.createTransport( {
    host: "smtp-relay.brevo.com",
    port: 465,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_KEY
    }
} );

/**
 * @description Read, render, and send the verificatoin email 
 * @param {email : email}
 * @param {32ByteToke : token}
 */

exports.sendVerificationMail = async function ( email, token )
{
    const templatePath = path.join( __dirname, "..", "views", "Mails", "mail-verificaton.ejs" );

    const template = await fs.promises.readFile( templatePath, "utf-8" );

    const rendered = ejs.render( template, { path: "none", docTitle: "Email", token } );

    transporter.sendMail( {
        from: "SpendSmart@SmartOrg.com",
        to: email,
        subject: "Verification Email",
        html: rendered
    } );
    return;
};


/**
 * @description Read, render, and send the password resetting email 
 * @param {email : email}
 * @param {32ByteToke : token}
 */

exports.sendResettingMail = async function ( email, token )
{
    const templatePath = path.join( __dirname, "..", "views", "Mails", "mail-reset.ejs" );

    const template = await fs.promises.readFile( templatePath, "utf-8" );

    const rendered = ejs.render( template, { path: "none", docTitle: "Email", token } );

    transporter.sendMail( {
        from: "SpendSmart@SmartOrg.com",
        to: email,
        subject: "Password Resetting Email",
        html: rendered
    } );
    return;
};