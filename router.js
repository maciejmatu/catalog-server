const express = require('express');

const router = app => {

	const apiRouter = require('./routes/api')(app);
	const authRouter = require('./routes/auth')(app);

	app.get('/', (req, res) => {
		const fullUrl = `${req.protocol}://${req.get('host')}`;
		res.send(`Api is available at ${fullUrl}/api`);
	});

	app.use('/api', apiRouter);
	app.use('/api/auth', authRouter);
}

module.exports = router;