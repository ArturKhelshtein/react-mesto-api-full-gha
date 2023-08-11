const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const signOutRouter = require('./signout');
const { auth } = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/signup', signUpRouter);
router.use('/signin', signInRouter);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/signout', signOutRouter);

module.exports = router;
