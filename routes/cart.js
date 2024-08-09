const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const NFT = require('../models/NFT');
const { isAuthenticated } = require('../middleware/auth');

// Display cart items
router.get('/', isAuthenticated, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('nfts');
  if (!cart || cart.nfts.length === 0) {
    res.render('cart', { message: 'Your cart is empty.' });
  } else {
    res.render('cart', { nfts: cart.nfts });
  }
});

// Add new NFT to cart
router.post('/add/:id', isAuthenticated, async (req, res) => {
  const nft = await NFT.findById(req.params.id);
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, nfts: [] });
  }
  cart.nfts.push(nft._id);
  await cart.save();
  res.redirect('/cart');
});

// Show form to edit an NFT in the cart
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const nft = await NFT.findById(req.params.id);
  res.render('edit-nft', { nft });
});

// Handle editing an NFT in the cart
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  const { title, description, imageUrl, price } = req.body;
  await NFT.findByIdAndUpdate(req.params.id, { title, description, imageUrl, price });
  res.redirect('/cart');
});

// Remove NFT from cart
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.nfts = cart.nfts.filter(nftId => nftId.toString() !== req.params.id);
    await cart.save();
  }
  res.redirect('/cart');
});

// Checkout
router.post('/checkout', isAuthenticated, async (req, res) => {
  // Here, you would normally process the order
  res.render('checkout', { message: "Your order has been placed and we'll update you with the details via email." });
});

module.exports = router;
