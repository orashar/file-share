const router = require('express').Router()

const File = require('../models/file')

router.get('/:uuid', async (req, res) => {
    try{
        const file = await File.findOne({uuid: req.params.uuid})
        if(!file){
            return res.render('download', {error: e.message})
        }
        return res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,

        })
    }catch(e){
        return res.render('download', {error: e.message})
    }

})






module.exports = router