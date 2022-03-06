const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({ //The disk storage engine gives you full control on storing files to disk.
  destination: (req, file, cb) => cb(null, 'uploads/'),//where ourfile will be stored it take req and a file and a callback fir para will be a error and a second para will be a place where our file be stored 
  filename: (req, file, cb) => { //filename is used to determine what the file should be named inside the folder
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    // Date.now() method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
    //math.random will return a random number b/t 0 and 1 and by mult 1E9 it willl return 5472354732 type no 
    //path .ext will return the extension name 
    //34345435345-5434534532525.png

    cb(null, uniqueName)
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },//limits - You can also put a limit on the size of the file that is being uploaded with the help of using limits.
}).single('myfile'); //100mb name atribute should be same 

router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(), // this will generate a uuid and will store in database
      path: req.file.path, // the path will be created by multer 
      size: req.file.size,
   
    });
    const response = await file.save();
    res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` }); 
    // this is a download page link  http//localhost:3000/files/2543543ghf343
  });
});

//DELETE File
router.delete("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (File.username === req.body.username) {
      try {
        await File.delete();
        res.status(200).json("file has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your file!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});






















//this is an email which i have to delete after some times 
router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: 'All fields are required except expiry.' });
  }
  // Get data from db 
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: 'Email already sent once.' }); // it means email already sent 
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/mailService'); //we are calling sevices email
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
        size: parseInt(file.size / 1000) + ' KB',
        expires: '24 hours'
      })
    }).then(() => {
      return res.json({ success: true });
    }).catch(err => {
      return res.status(500).json({ error: 'Error in email sending.' });
    });
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }

});

module.exports = router;