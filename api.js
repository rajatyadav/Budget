var express 		= require('express'),
		mongo				= require('mongodb'),
		monk				= require('monk'),
		bodyParser 	= require('body-parser'),

		db					= monk('localhost:27017/budget');
		router			= express.Router();

router
	// .use(function (req, res, next) {
	// 	if( !req.member ) res.member = { id:1 };
	// 	next();
	// })
	.use(bodyParser.json())
	.route('/members')
			.get(function (req, res) {
					var collection = db.get('member');
					collection.find({}, {}, function (err, data) {
						res.json(data);
					});
			})
			.post(function (req, res) {
					var member = req.body;
					var collection = db.get('member');
					collection.insert(member, function (err, data) {
						res.json(data);
					})
			})

router
	.param('id', function (req, res, next) {
		req.dbQuery = { _id: req.params.id };
		next();
	})
	.route('/members/:id')
		.get(function (req, res) {
				var collection = db.get('member');
				collection.findOne(req.dbQuery, function (err, data) {
					res.json(data);
				});
		})
		.put(function (req, res) {
				var member = req.body;
				var collection = db.get('member');
				collection.update(req.dbQuery, member, function (err, data) {
					res.json(data[0]);
				});
		})
		.delete(function (req, res) {
				var collection = db.get('member');
				collection.remove( req.dbQuery, function (err, data) {
					res.json(null);
				})
		});


router
	.use(bodyParser.json())
	.route('/expences')
			.get(function (req, res) {
					var collection = db.get('memberExpences');
					collection.find({}, {}, function (err, data) {
						res.json(data);
					});
			})
			.post(function (req, res) {
					var date = new Date();
					var expence = req.body;
					expence.timestamp = date;
					var collection = db.get('memberExpences');
					collection.insert(expence, function (err, data) {
						res.json(200);
					})
			});

router
	.param('user_id', function (req, res, next) {
		req.dbQuery = { member : req.params.user_id };
		next();
	})
	.route('/expences/:user_id')
		.get(function (req, res) {
				var collection = db.get('memberExpences');
				collection.find(req.dbQuery , function (err, data) {
					res.json(data);
				});
		});
			

module.exports = router;