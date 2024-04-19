require('dotenv').config({
    path: process.env.NODE_ENV === 'development' ? '.env.development' : 'production.env'
});
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const { APP_PORT } = require('./utils/ports');
const { handlerError } = require('./error/error.helper');
const { authRoute } = require('./routes/auth.route');
const { authorizedUser } = require('./middleware/auth.middleware');
const app = express();

app.use(express.json())
app.use(cors());

app.use('/auth', authRoute)
app.use('/users', authorizedUser, userRoute);
app.use(handlerError)

app.listen(APP_PORT, () => {
    console.log('CONNECTED ON PORT: ', APP_PORT);
})