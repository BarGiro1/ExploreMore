module.exports = {
  apps : [{
    name   : "app1",
    script : "cp .env_prod .env && tsc -p tsconfig_prod.json && node ./dist/src/app.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
