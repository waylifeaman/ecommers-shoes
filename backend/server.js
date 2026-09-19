const express = require('express');
const cors = require('cors'); 

const app = express();
app.use(cors());
app.use(express.json());

const userRoute = require('./routes/users')
const productRoute = require('./routes/product')
const categoryRoute = require('./routes/category')
const orderRoute = require('./routes/order')
const orderItemRoute = require('./routes/order_item')
const cartRoute = require('./routes/cart')
const productSizeRoute = require('./routes/product_size')


app.use('/data-users', userRoute);
app.use('/data-product', productRoute);
app.use('/data-category', categoryRoute);
app.use('/data-order', orderRoute);
app.use('/data-cart', cartRoute);
app.use('/data-order-item', orderItemRoute);
app.use('/data-size-product', productSizeRoute);
  
app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));