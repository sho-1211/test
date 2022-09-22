var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use("/api/notify", function(req,res,next){

	var options = {
	  url: 'https://clm-sl-ans-live-ans-service-api.cfapps.eu10.hana.ondemand.com/cf/producer/v1/resource-events', 
	  method: 'POST',
	  auth: {
	    user: "2462f3f8-58a1-4b5a-92cf-0b04e4647f7d", 
	    password: "GXXUTsWrBlMLfCjyUgz1TM1ieejVYCfH"
	  },
	  json: {
			  "eventType": "mycustomevent",
			  "resource": {
			    "resourceName": "Your Node.js App.",
			    "resourceType": "app",
			    "tags": {
			      "env": "develop environment"
			    }
			  },
			  "severity": "FATAL",
			  "category": "ALERT",
			  "subject": "Something is wrong.",
			  "body": "Hello world",
			  "tags": {
			    "ans:correlationId": "30118",
			    "ans:status": "CREATE_OR_UPDATE",
			    "customTag": "42"
			  }
		}
	}

	// Send request
	request(options, function (error, response, body) {
		console.log(response.body);

		res.send('Send E-mail Notification.');
	});

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;