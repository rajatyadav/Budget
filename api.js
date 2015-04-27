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
					var expence = req.body;
					var dateParts = expence.timestamp.split('-'),
			    	y = parseInt(dateParts[0], 10),
			    	m = parseInt(dateParts[1], 10),
			    	d = parseInt(dateParts[2], 10);
		      expence.timestamp = new Date(y, m-1, d, 12, 0, 0);
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
router
	.param('id', function (req, res, next) {
		req.dbUpdateQuery = { _id : req.params.id };
		next();
	})
	.route('/expences/:id')
		.get(function (req, res) {
				var collection = db.get('memberExpences');
				collection.findOne(req.dbUpdateQuery, function (err, data) {
					res.json(data);
				});
		})
		.put(function (req, res) {
				var updatedExpence = req.body;
				var collection = db.get('memberExpences');
				collection.update(req.dbUpdateQuery, updatedExpence, function (err, data) {
					res.json(200);
				});
		});

router
	.param('datetime', function (req, res, next) {
		var start = new Date( req.params.datetime ),
	    	dateParts = req.params.datetime.split('-'),
	    	y = parseInt(dateParts[0], 10),
	    	m = parseInt(dateParts[1], 10),
	    	d = parseInt(dateParts[2], 10),
      	end = new Date(y, m-1, d+1);  
    req.dbDateQuery = {timestamp: { $gte: start, $lt: end }};
		next();
	})
	.route('/expencesTime/:datetime')
		.get(function (req, res) {
				var collection = db.get('memberExpences');
				collection.find(req.dbDateQuery, function (err, data) {
					res.json(data);
				});
		});
			

router
	.use(bodyParser.json())
	.route('/contree')
		.get(function (req, res) {
				var collection = db.get('memberContree');
				collection.find({}, {}, function (err, data) {
					res.json(data);
				});
		})
		.post(function (req, res) {
				var date = new Date();	
				var contree = req.body;
				contree.timestamp = date;
				var collection = db.get('memberContree');
				collection.insert(contree, function (err, data) {
					res.json(data);
				})
		})

router
	.param('id', function (req, res, next) {
		req.dbContreeQuery = { _id : req.params.id };
		next();
	})
	.route('/contree/:id')
			.put(function (req, res) {
					var memberCon = req.body;
					var collection = db.get('memberContree');
					collection.update(req.dbContreeQuery, memberCon, function (err, data) {
					res.json(data[0]);
				});
			})

router
	.param('memberId', function (req, res, next) {
		req.dbQuery = { member : req.params.memberId };
		next();
	})
	.route('/contree/:memberId')
			.get(function (req, res) {
					var collection = db.get('memberContree');
					collection.findOne(req.dbQuery, function (err, data) {
						res.json(data);
					});
			})

module.exports = router;