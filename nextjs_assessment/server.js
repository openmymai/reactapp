const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.get('/assessments/:id', (req, res) => {
      const actualPage = '/assessments';
      const queryParams = { id: req.params.id };
      console.dir("req.params.id = " + JSON.stringify(req.params.id));
      app.render(req, res, actualPage, queryParams);
    })

    server.get('/assessmentlist', (req, res) => {
      const actualPageList = '/assessmentlist';
      app.render(req, res, actualPageList);
    })

    server.get('*', (req, res) => {
      return handle(req, res);
    })

    server.listen(8001, (err) => {
      if (err) throw err;
      console.log('> Ready on port 8001');
    })
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  })