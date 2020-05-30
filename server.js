const express = require('express')
const mustacheExpress = require('mustache-express')
const fs = require('fs')
var fx = require("money");
const bodyParser = require('body-parser')
require('dotenv').config()


const nodemailer = require("nodemailer");
const { Client } = require('pg')

// importing express module
const app = express()
// importing mustache express module
const mustache = mustacheExpress();
mustache.cache = null;

// PDF parser library
const pdfparse = require('pdf-parse')

// DOC parser library
const mammoth = require("mammoth")

const upload = require('express-fileupload')
// configuring the templating engine
app.engine('mustache', mustache);
app.set('view engine', 'mustache');
app.use(upload())


const PORT = process.env.PORT || 5000

//Establishing a connection to the PostGreSQL DATABASE 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));


app.get('/get-started', (request, response) => {

    
    response.render("get-started");

    })

app.post('/generate-prices', (request, response) => {

    // console.log("Here we are !")

    let fromLanguage = request.body.fromLanguage;
    let toLanguage = request.body.toLanguage;
    let context = request.body.context;
    let deliveryDate = request.body.deliveryDate;
    let file = request.files;
    let filename = request.files.fileUpload.name;
    let format = file.fileUpload.name.split(".").pop()

    console.log(file.fileUpload.name.split(".").pop())

    
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        password: 'adetoyosi',
        database: 'wetranslate',
        port: 5432,

    });

     client.connect()
        .then(() => {
         console.log('Connection Completed !');
         const sql = 'INSERT INTO getstarted (fromlanguage,tolanguage, deliverydate,context, filename) VALUES ($1, $2, $3, $4, $5)'
         const params = [request.body.fromLanguage, request.body.toLanguage, request.body.deliveryDate, request.body.context, request.files.fileUpload.name]
         return client.query(sql, params);
     })
 
        .then((result) => {
         console.log('results?', result)
 
     })
 

    file.fileUpload.mv('./uploads/'+filename, (err) => {

        if (err){
            console.log("shit")
        }

        else if(format === "pdf"){
            console.log("File Uploaded !")
            const pdffile = fs.readFileSync('./uploads/'+filename);
            pdfparse(pdffile).then( (data) => {
                let wordLength = data.text.replace( /[\r\n]+/gm, " " ).replace(/\s|[0-9_]|\W|[#$%^&*()]/g, " ").replace(/\s+/g,' ').split(" ").length ;
                let pricePerWordBasic = 5;
                let pricePerWordProf = 10;
                let pricePerWordPremium = 20;
                let priceBasic = wordLength * pricePerWordBasic;
                let priceProf = wordLength * pricePerWordProf;
                let pricePremium = wordLength * pricePerWordPremium;
                results = {"priceBasic": Math.round(priceBasic/390),
                            "priceProf":Math.round(priceProf/390),
                            "pricePremium":Math.round(pricePremium/390),
                            "wordLength": wordLength,
                            "pricePerWordBasic":(pricePerWordBasic/390).toFixed(3), 
                            "pricePerWordProf": (pricePerWordProf/390).toFixed(3),
                            "pricePerWordPremium": (pricePerWordPremium/390).toFixed(3),
                            "show": true,
                            "filename": filename,
                            "file": file,
                        }
                return results ;
                
            }).then((results) => {
            // console.log(results)
            response.render("get-started", results)

            })}

        else if(format === "docx"){
            mammoth.extractRawText({path: "./uploads/"+filename})
            .then(function(result){
                const wordLength = result.value.replace(/\s|[0-9_]|\W|[#$%^&*()]/g, " ").replace(/\s+/g,' ').split("").length; // The raw text
                let pricePerWordBasic = 5;
                let pricePerWordProf = 10;
                let pricePerWordPremium = 20;
                let priceBasic = wordLength * pricePerWordBasic;
                let priceProf = wordLength * pricePerWordProf;
                let pricePremium = wordLength * pricePerWordPremium;
                results = {"priceBasic": Math.round(priceBasic/390),
                            "priceProf":Math.round(priceProf/390),
                            "pricePremium":Math.round(pricePremium/390),
                            "wordLength": wordLength,
                            "pricePerWordBasic":(pricePerWordBasic/390).toFixed(3), 
                            "pricePerWordProf": (pricePerWordProf/390).toFixed(3),
                            "pricePerWordPremium": (pricePerWordPremium/390).toFixed(3),
                            "show": true,
                            "filename": filename,
                            "file": file,
                        }
                
                response.render("get-started", results)
    })

        }
        })

    

})

app.post("/pay", (request, response) => {

    let selectedPlan = request.body.selectedPlan;
    let totalCost = request.body.totalCost;
    let fileName = request.body.fileName;
    let useremail = request.body.useremail;
    let telephone = request.body.telephone;
    let description = request.body.notes;

    const client = new Client({
    
        user: 'postgres',
        host: 'localhost',
        password: 'adetoyosi',
        database: 'wetranslate',
        port: 5432,

    });

     client.connect()
        .then(() => {
       
            return client.query('SELECT * FROM getstarted ORDER BY -id LIMIT 1');
     })
 
        .then((result) => {
         
            const fromlanguage = result.rows[0].fromlanguage;
            const tolanguage = result.rows[0].tolanguage;
            const deliverydate = result.rows[0].deliverydate;
            const context = result.rows[0].context;
            
            let transporter = nodemailer.createTransport({
                service: 'gmail', 
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
                tls: {
                rejectUnauthorized: false
            }
            });

        
            let mailOptions = {
                from: useremail,
                to: "rexsimiloluwa@gmail.com",
                // cc: useremail,
                // bcc: useremail,
                subject: "New Request from WE TRANSLATE 🚀",
                text: "New Request from WE TRANSLATE 🚀"+"\r\n"+
                      "User E-mail:- " +useremail+"\r\n"+
                      "Selected Plan:- "+ selectedPlan+ "\r\n"+
                      "Total Cost:- "+ totalCost+ "\r\n"+
                      "From Language:- "+ fromlanguage+"\r\n"+
                      "To Language:- "+ tolanguage+"\r\n"+
                      "Delivery Date:- "+ deliverydate+ "\r\n"+
                      "Context:- "+ context+ "\r\n"+
                      "Telephone:- "+ telephone+ "\r\n"+
                      "Description:- "+ description
                      ,
                // html: "<b style='color:##B452CD;border: 1px solid #B452CD;padding: 20px;'>New Request from WE TRANSLATE 🚀</b>",
                attachments: [
                    { 
                        filename: fileName,
                        path: './uploads/'+fileName
                    }
                ]
            };

            transporter.sendMail(mailOptions, (err,data) => {
                if (err){

                    console.log("Error Occurred", err)
                }
                else{

                    console.log("Email sent !")
                }
            });

            response.render('success')
     })



})

app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`))

