const express = require('express');
const favicon = require('serve-favicon');
const cors = require('cors');
const app = express();
const path = require('path');
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const users = {test: 'test'}


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')

app.use('/api-spec-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const session = require('express-session');

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(cors());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhh, very secret'
}));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

function restrictAPI(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401);
    res.send({errorCode: 'UNAUTHORIZED'})
  }
}


// ### API
app.post('/signup', (req, res) => {
  // #swagger.tags = ['API']
  const { login, password, password2 } = req.body;

  if (!login || !password || typeof login != 'string' || login.length > 30 || typeof password != 'string' && password.length > 20 || (password !== password2 && password2)){
    res.status(400);
    res.send({errorCode: 'BAD_REQUEST'})
    return;
  }

  if (users[login]){
    res.status(400);
    res.send({errorCode: 'ALREADY_EXISTS_USER'});
  } else {
    users[login] = password
    res.status(200);
    res.json({redirect: `/login`})
  }
});
app.post('/login', (req, res) => {
  // #swagger.tags = ['API']
  const { login, password } = req.body;

  if (!login || !password || typeof login != 'string' || login.length > 30 || typeof password == 'string' && password.length > 20){
    res.status(400);
    res.send({errorCode: 'BAD_REQUEST'})
    return;
  }

  if (users[login] && users[login] == password){
    req.session.regenerate(function(){
      req.session.user = login;
      res.status(200)
      res.json({redirect: `/home`});
    });
  } else {
    res.status(401);
    res.send({errorCode: 'UNAUTHORIZED'})
  }
});
app.post('/logout', restrictAPI, (req, res) =>  { 
  // #swagger.tags = ['API']
    return req.session.destroy(() => {
      res.status(200)
      res.send()
    })
})
app.get('/get-user-info', restrictAPI, (req, res) => {
  // #swagger.tags = ['API']
  res.status(200);
  res.json({'username': req.session.user})
})


// ### Pages
app.get('/signup', (req, res) => {
  // #swagger.tags = ['Pages']
  // #swagger.produces = ['text/html']
  return res.render('signup')
});
app.get('/login', (req, res) => {
  // #swagger.tags = ['Pages']
  // #swagger.produces = ['text/html']
  return res.render('login')
});
app.get('/logout', restrict, (req, res) => {
  // #swagger.tags = ['Pages']
  // #swagger.produces = ['text/html']
  return req.session.destroy(() => res.redirect('/login'))
})
app.get('/home', restrict, (req, res) => {
  // #swagger.tags = ['Pages']
  // #swagger.produces = ['text/html']
  return res.render('home', {username: req.session.user})
});
app.get('/', restrict, (req, res) => {
  // #swagger.tags = ['Pages']
  // #swagger.produces = ['text/html']
  return res.redirect('/home')
});


app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`))
