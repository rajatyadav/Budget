var express = require('express'),
		api			= require('./api'),
		users		= require('./accounts'),
		app			= express();

app
		.use(express.static('./public'))
		.use('/api', api)
		.use(users)
		.get('*', function (req, res) {
				if (!req.user) {
					res.redirect('/login');
				} else {
					res.sendfile(__dirname + '/public/main.html');
				}
		})
		.listen(3000);