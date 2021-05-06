const express = require('express')
const app = express();

const path = require('path')

const cors = require('cors')

const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.json())

// database connection
const connectDB = require('./config/db.js')
connectDB()

//cors
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}

app.use(cors(corsOptions))

//template engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

// init routes
app.use('/api/files', require('./routes/files'))
app.use('/files', require('./routes/show'))
app.use('/files/download', require('./routes/download'))

// server listen
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})