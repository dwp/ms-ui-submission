import express from 'express';

const router = new express.Router();

export default () => {
  router.use((req, res, next) => {
    res.locals.page_path = req.path;
    next();
  });
};
