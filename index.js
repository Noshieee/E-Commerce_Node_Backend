require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authUser = require('./middleware/auth')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

const app = express()

app.use(express.json())
app.use(cors())

const productRouter = require('./routes/productRoute')
const userRouter = require('./routes/userRoute')

app.use('/products', productRouter)
app.use('/users', userRouter)

app.get('/', (req, res) => {
    res.send('Home Page')
})

app.listen(process.env.PORT||4422, () => console.log('Server running'))