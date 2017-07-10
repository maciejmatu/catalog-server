module.exports = {
	secret: 'Hi2T5sT1tKz7094i66Cl',
	database: process.env.DATABASE_URL || 'mongodb://admin:h3r2a8@ds149489.mlab.com:49489/catalog-app',
	port: process.env.PORT || 8000,
  clientURL: process.env.CLIENT_URL || 'http://localhost:8000'
}