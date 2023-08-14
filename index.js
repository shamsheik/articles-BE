const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const mongoose = require('mongoose');
var corsOptions = {
    credentials: true,
    origin:["http://localhost:4200","http://localhost:4000" ]
}
app.use(cors(corsOptions));
const connectionURL = 'mongodb+srv://shamrin192:Shamrin@cluster0.ldtsvzx.mongodb.net/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(connectionURL, options)
  .then(() => {
    console.log('Connected to MongoDB');
    // Additional code after successful connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const routes = require('./routes/routes');
app.use(express.json());
app.use('/register',routes);
app.use('/login',routes);
app.use('/userlogin',routes);
app.use('/userlogout',routes);
app.get('/test-cookies', (req, res) => {
  res.json(req.cookies);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server running on port ${PORT}`));