let app = express();
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'html');
app.set('port', 4962)

//engine setup
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index')

app.use('/', indexRouter)

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : '[crawzach]',
  password        : '[6352]',
  database        : '[crawzach]'
});

module.exports.pool = pool;



// Get the home page
app.get('/', function(req, res, next) {
  res.render('index')
}) ;

// Get the galaxies page
app.get('/galaxies', function(req, res, next) {
  let context = {};
  pool.query('SELECT * from galaxies', function(err, rows, fields){
    if (err) {
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('galaxies', context)
  })
})

// get the hostSystems page
app.get('/hostSystems', function(req, res, next) {
  let context = {};
  pool.query('SELECT * FROM hostSystems', function(err, rows, fields){
    if (err) {
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('hostSystems', context)
  })
})

// get the stars page
app.get('/stars', function(req, res, next) {
  let context = {};
  pool.query('SELECT * FROM stars', function(err, rows, fields){
    if (err) {
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('stars', context)
  })
})

// get the exoplanets page
app.get('/exoplanets', function(req, res, next) {
  let context = {};
  pool.query('SELECT * FROM exoplanets', function(err, rows, fields){
    if (err) {
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('exoplanets', context)
  })
})

// get the M:M exoplanets:stars table page
app.get('/EPSRelation', function(req, res, next) {
  let context = {};
  pool.query('SELECT * FROM exoplanetStarRelationShip', function(err, rows, fields){
    if (err) {
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('EPSRelation', context)
  })
})

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});
