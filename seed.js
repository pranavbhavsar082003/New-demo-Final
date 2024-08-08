require('dotenv').config();
const mongoose = require('mongoose');
const NFT = require('./models/NFT');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create a default user
    const user = new User({ username: 'testuser' });
    await User.register(user, 'password123');
    
    const nfts = [
      { title: 'NFT 1', description: 'Description 1', imageUrl: '/images/nft1.jpg', price: 100, owner: user._id },
      { title: 'NFT 2', description: 'Description 2', imageUrl: '/images/nft2.jpg', price: 150, owner: user._id },
      { title: 'NFT 3', description: 'Description 3', imageUrl: '/images/nft3.jpg', price: 200, owner: user._id },
      { title: 'NFT 4', description: 'Description 4', imageUrl: '/images/nft4.jpg', price: 250, owner: user._id },
      { title: 'NFT 5', description: 'Description 5', imageUrl: '/images/nft5.jpg', price: 300, owner: user._id },
      { title: 'NFT 6', description: 'Description 6', imageUrl: '/images/nft6.jpg', price: 350, owner: user._id },
      { title: 'NFT 7', description: 'Description 7', imageUrl: '/images/nft7.jpg', price: 400, owner: user._id },
      { title: 'NFT 8', description: 'Description 8', imageUrl: '/images/nft8.jpg', price: 450, owner: user._id },
      { title: 'NFT 9', description: 'Description 9', imageUrl: '/images/nft9.jpg', price: 500, owner: user._id },
      { title: 'NFT 10', description: 'Description 10', imageUrl: '/images/nft10.jpg', price: 550, owner: user._id },
    ];
    
    await NFT.insertMany(nfts);
    console.log('Seeded 10 NFTs');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
