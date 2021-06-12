import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import passport from 'passport';

import authRouter from './routes/auth';
import passportConfig from './passport';

dotenv.config();

const corsOption = {
  origin: 'http://localhost:3000/',
};

const app = express();
app.set('port', process.env.PORT || 3000);
passportConfig();

app.use(cors(corsOption));
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie',
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.status || 500).json();
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
