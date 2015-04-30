var express 		= require('express'),
		mongo				= require('mongodb'),
		monk				= require('monk'),
		ObjectId 		= require('mongodb').ObjectID,
		bodyParser 	= require('body-parser'),
		session 		= require('express-session'),
		crypto			= require('crypto'),

		router			= express.Router(),
		db					= monk('localhost:27017/budget');

function hash (password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

router
	.use(bodyParser.urlencoded())
	.use(bodyParser.json())
	.use(session({ secret: 'hcdjnxcds6cebs73ebd7e3bdb7db73e' }))
	.get('/login', function (req, res) {
		res.sendfile('public/login.html');
	})
	.post('/login', function (req, res) {
			var user = {
				username : req.body.username,
				password : hash(req.body.password)
			};
			var collection = db.get('users');
			collection.findOne (user, function (err, data) {
				if (data) {
					req.session.userId = data._id;
					res.redirect('/');
				} else {
					res.redirect('/login');
				}
			});
	})
	.post('/register', function (req, res) {
			var user = {
				username : req.body.username,
				password : hash(req.body.password),
				email		 : req.body.email
				// members  = {}
			};
			var collection = db.get('users');
			collection.find({ username : user.username}, function (err, data) {
				if (!data.length) {
					collection.insert( user, function (err, data) {
						req.session.userId = data._id;
						res.redirect('/');
					})
				} else {
					res.redirect('/login');
				}
			});
	})
	.get('/logout', function (req, res) {
			req.session.userId = null;
			
			res.redirect('/');
	})
	.use(function (req, res, next) {
			if (req.session.userId) {
				var collection = db.get('users');
				collection.findOne({ _id : new ObjectId(req.session.userId)}, function (err, data) {
					req.user = data;
					next();
				});
			} else {
				next();
			}
			
	})
	.get('/User', function (req, res) {
			if(!req.user) {
					res.json(200);
			} else {
					res.json(req.user.username);
			}
	});

module.exports = router;