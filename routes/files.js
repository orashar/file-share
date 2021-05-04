const router = require('express').Router()

const { strict } = require('assert')
const multer = require('multer')
const path = require('path')

const {v4: uuid4} = require('uuid')

const File = require('../models/file.js')


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limit: {fileSize: 100000000},
}).single('myfile')


router.post('/', (req, res) => {
    

    // store incoming file
    upload(req, res, async (e) => {
        // validate request
        if(!req.file){
            return res.json({error: "File is required"})
        }
        if(e){
            return res.status(500).send({error : e.message})
        }

        // store into Database
        const file = new File({
            filename: req.file.filename,
            uuid:  uuid4(),
            path: req.file.path,
            size: req.file.size,
        })

    // response -> Link
        const response = await file.save()
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})

    })




})


router.post('/send', async (req, res) => {
    const {uuid, emailto, emailfrom} = req.body

    
    // validate request
    if(!uuid || !emailto || !emailfrom){
        return res.status(422).send({error: "All fields are required"})
    }

    // get data from database
    const file = await File.findOne({uuid: uuid})
    if(file.sender){
        return res.status(422).send({error: "Email already sent"})
    }

    file.sender = emailfrom
    file.receiver = emailto

    const response = await file.save()

    // send email
    const sendMail = require('../services/emailService')
    sendMail({
        from: emailfrom,
        to: emailto,
        subject: "File Share",
        text: `${emailfrom} shared a fle with you.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailfrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: file.size,
            expires: '24 hours'
        })
    })


    return res.send({success: true})
})


module.exports = router