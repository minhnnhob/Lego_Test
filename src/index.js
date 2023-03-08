const path = require('path')
const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const route = require('./routes');
const db = require('./config/db');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

db.connect();

app.use(morgan('combined'));
app.engine(
  'hbs',
  engine({
      extname: '.hbs',
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  express.urlencoded({
      extended: true,
  }),
);
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));



route(app);



app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
})