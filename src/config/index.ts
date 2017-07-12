let config: {
  secret: string,
  database: string,
  port: number,
  serverHost: string,
  clientURL: string
}

export default config = {
  secret: process.env.SECRET || 'default',
  database: process.env.DATABASE_URL || 'mongodb://localhost:27017/catalog-app',
  port: process.env.PORT || 9001,
  serverHost: process.env.HOST || 'http://localhost',
  clientURL: process.env.CLIENT_URL || 'http://localhost:9000'
}
