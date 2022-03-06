const Database = require('./config/db');
const File = require('./models/file');
const fs = require('fs');

Database();

// Get all records older than 24 hours 
async function fetchData() {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} }) //$lt = less then 
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path); // it will remove from upload folte 
                await file.remove(); // this will remove from database
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');
}

fetchData().then(process.exit);