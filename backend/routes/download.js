const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {

   const file = await File.findOne({ uuid: req.params.uuid });
 
   if(!file) {
        return res.render('download', { error: 'Link has been expired.'}); //if there is no file 
   } 
   const response = await file.save();
   const filePath = `${__dirname}/../${file.path}`; 
   // here we are generating the file path 
   // here it will the the file path name and it will start downloading 
   res.download(filePath);
});


module.exports = router;