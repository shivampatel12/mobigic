const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => { //: means it is a dynamic parameter hai 
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        // Link expired
        if (!file) {
            return res.render('download', { error: 'Link has been expired.' });
        }
        return res.render('download', {

            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` // here we are generating  the  original download link 
            //http://localhost:3000/files/download/234hdjk-fh435345

        });
    } catch (err) {
        return res.render('download', { error: 'Something went wrong.' });
    }
});


module.exports = router;