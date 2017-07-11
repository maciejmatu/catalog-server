let config: {
  secret: string,
  database: string,
  port: number,
  serverHost: string,
  clientURL: string
}

export default config = {
  secret: 'Hi2T5sT1tKz7094i66Cl',
  database: process.env.DATABASE_URL || 'mongodb://admin:h3r2a8@ds149489.mlab.com:49489/catalog-app',
  port: process.env.PORT || 9001,
  serverHost: process.env.HOST || 'http://localhost',
  clientURL: process.env.CLIENT_URL || 'http://localhost:9000'
}
