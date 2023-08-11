const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const router = require('./routes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const ErrorNotFound = require('./errors/error-not-found');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(cors({ origin: 'http://localhost:3001', credentials: true, maxAge: 30 }));
app.use(helmet());
app.use(express.json());
app.use(cookies());
app.use(requestLogger);
app.use(router);
app.use((req, _res, next) => next(new ErrorNotFound(`Ресурс по адресу ${req.path} не найден`)));

app.use(errorLogger);

app.use(errors());
app.use(errorMiddleware);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
