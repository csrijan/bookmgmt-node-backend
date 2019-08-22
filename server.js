const http = require('http');
const app = require('./app');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port);

console.log("Express server listening on port " + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./routes/bookmgmtRoutes');
routes(app);