const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 50 },
  { id: 2, name: 'Phone', price: 699.99, category: 'Electronics', stock: 100 },
  { id: 3, name: 'Headphones', price: 199.99, category: 'Electronics', stock: 200 },
  { id: 4, name: 'Desk Chair', price: 299.99, category: 'Furniture', stock: 30 },
  { id: 5, name: 'Keyboard', price: 89.99, category: 'Electronics', stock: 150 }
];

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with id ${req.params.id} not found`
    });
  }
  res.status(200).json({ success: true, data: product });
});

router.post('/', (req, res) => {
  const { name, price, category, stock } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, price and category'
    });
  }
  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category,
    stock: stock || 0
  };
  products.push(newProduct);
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

module.exports = router;