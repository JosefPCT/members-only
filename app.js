const express = require("express");

const indexRouter = require('./routes/indexRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log("Listening to Port: ", PORT);
});