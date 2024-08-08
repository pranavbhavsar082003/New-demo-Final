const express = require('express');
const router = express.Router();
const NFT = require('../models/NFT');
const { isAuthenticated } = require('../middleware/auth');

// Display all NFTs
router.get('/', async (req, res) => {
  const nfts = await NFT.find();
  res.render('nfts', { nfts });
});

// Search NFTs by title
router.get('/search', async (req, res) => {
  const query = req.query.q;
  const nfts = await NFT.find({ title: { $regex: query, $options: 'i' } });
  if (nfts.length === 0) {
    res.render('nfts', { message: 'This NFT is not available, you can create your own NFT', query });
  } else {
    res.render('nfts', { nfts, query });
  }
});

// Show form to add a new NFT
router.get('/add', isAuthenticated, (req, res) => {
  res.render('add_nft');
});

// Handle adding a new NFT
router.post('/add', isAuthenticated, async (req, res) => {
  const { title, description, imageUrl, price } = req.body;
  const nft = new NFT({ title, description, imageUrl, price, owner: req.user._id });
  await nft.save();
  res.redirect('/nfts');
});

// Show form to edit an NFT
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const nft = await NFT.findById(req.params.id);
  res.render('edit-nft', { nft });
});


module.exports = router;
