require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const NFT = require('./models/NFT');
const User = require('./models/User');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const nftsRouter = require('./routes/nfts');
const cartRouter = require('./routes/cart');

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Seed data
    const user = await User.findOne({ username: 'testuser' });
    if (!user) {
      const newUser = new User({ username: 'testuser', email: 'testuser@example.com' });
      await User.register(newUser, 'password123');

      const nfts = [
        { title: 'Digital Art 1', description: 'Description for Digital Art 1', imageUrl: '/images/nft1.jpg', price: 100, owner: newUser._id },
        { title: 'Crypto Collectible 2', description: 'Description for Crypto Collectible 2', imageUrl: '/images/nft2.jpg', price: 150, owner: newUser._id },
        { title: 'Virtual Asset 3', description: 'Description for Virtual Asset 3', imageUrl: '/images/nft3.jpg', price: 200, owner: newUser._id },
        { title: 'Unique Token 4', description: 'Description for Unique Token 4', imageUrl: '/images/nft4.jpg', price: 250, owner: newUser._id },
        { title: 'Blockchain Art 5', description: 'Description for Blockchain Art 5', imageUrl: '/images/nft5.jpg', price: 300, owner: newUser._id },
        { title: 'Digital Artwork 6', description: 'Description for Digital Artwork 6', imageUrl: '/images/nft6.jpg', price: 350, owner: newUser._id },
        { title: 'Crypto Art 7', description: 'Description for Crypto Art 7', imageUrl: '/images/nft7.jpg', price: 400, owner: newUser._id },
        { title: 'Virtual Collectible 8', description: 'Description for Virtual Collectible 8', imageUrl: '/images/nft8.jpg', price: 450, owner: newUser._id },
        { title: 'Unique Digital Asset 9', description: 'Description for Unique Digital Asset 9', imageUrl: '/images/nft9.jpg', price: 500, owner: newUser._id },
        { title: 'Blockchain Collectible 10', description: 'Description for Blockchain Collectible 10', imageUrl: '/images/nft10.jpg', price: 550, owner: newUser._id },
      ];

      await NFT.insertMany(nfts);
      console.log('Seeded 10 NFTs');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Use secure: true if using HTTPS
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/nfts', nftsRouter);
app.use('/cart', cartRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
