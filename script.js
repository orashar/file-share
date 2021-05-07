const File = require('./models/file')
const fs = require('fs')
const connectDB = require('./config/db')

connectDB()

async function fetchData(){
    // fetch 24 hours old files
    const pastDate = new Date(Date.now() - 86400000)
    const files = await File.find({createdAt: { $lt: pastDate}})

    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path)
                await file.remove();
                console.log(`successfully deleted ${file.filename} because the time expired`)
            }catch(e){
                console.log(`Error while deleting file. ${e}`)
            }
            
        }
        console.log("Expired files deleted")
    }
}

fetchData().then(process.exit)