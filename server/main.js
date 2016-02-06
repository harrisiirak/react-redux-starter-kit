import express from 'express';
import bodyParser from 'body-parser';
import jwtCheck from 'express-jwt';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import _debug from 'debug';
import config from '../config';
import jwt from 'jsonwebtoken';
import faker from 'faker';

const debug = _debug('app:server');
const paths = config.utils_paths;
const app = new express();

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig);

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output;

  app.use(require('./middleware/webpack-dev')(compiler, publicPath));
  app.use(require('./middleware/webpack-hmr')(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.client('static')));
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(convert(serve(paths.base(config.dir_dist))));
}

app.use(bodyParser.json());

const secret = 'jsontokensecret';
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'password',
    group: 'admin'
  }
];

app.post('/sessions/create', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      status: 'error',
      data: 'Missing username or password'
    });
    return;
  }

  let user = users.filter((u) => u.username === req.body.username && u.password === req.body.password);
  if (!user.length) {
    res.status(400).json({
      status: 'error',
      data: 'Invalid user'
    });
    return;
  }

  user = users[0];
  let token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '12h' });

  res.status(200).json({
    status: 'ok',
    data: token
  });
});

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.use('/api', jwtCheck({ secret }), (req, res, next) => {
  let n = 0;
  let c = 50;
  let s = [];

  while (n++ < c) {
    s.push(faker.helpers.userCard());
  }

  res.status(200).json(s);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || err.code).json({
      status: 'error',
      data: err.message
    });
    return;
  }

  next();
});

export default app;
