const express = require('express');

const app = express(); 

const port = 4000

app.use(express.json());

let users = [
	{
		email: "aaronzulueta@gmail.com",
		password: "aaron123",
		isAdmin: true
	},
	{
		email: "nicanorabelar@yahoo.com",
		password: "canorian09",
		isAdmin: false
	},
	{
		email: "pogisiAko@gmail.com",
		password: "090909aabc",
		isAdmin: false
	}
]

let products = [
	{
		name: "Apple iPhone 14 Pro Max",
		description: "A new flagship phone by Apple!",
		price: 75000,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
    },
	{
		name: "Kojie San Whitening Soap",
		description: "A soad that will surely whitens your skin!",
		price: 99,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
	},
	{
		name: "USB to Type-C OTG",
		description: "Transfer files easily with the our on-the-go adapter",
		price: 50,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
	},
]

let order = [
	{
		userId: 1,
    	products: [
      	{ name: "Apple iPhone 14 Pro Max",
		description: "A new flagship phone by Apple!",
		price: 75000,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }) },
      	{ name: "Kojie San Whitening Soap",
		description: "A soad that will surely whitens your skin!",
		price: 99,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }) },
    	{
    		name: "USB to Type-C OTG",
		description: "Transfer files easily with the our on-the-go adapter",
		price: 50,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
    	}
    ],
    	totalAmount: 75149,
    	purchasedOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
  },
	{
		userId: 2,
    	products: [
      	{ name: "Apple iPhone 14 Pro Max",
		description: "A new flagship phone by Apple!",
		price: 75000,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }) },
      	{ name: "Kojie San Whitening Soap",
		description: "A soad that will surely whitens your skin!",
		price: 99,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }) }
    ],
    	totalAmount: 75099,
    	purchasedOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
	},
	{
		userId: 3,
    	products: [
      	{ name: "Apple iPhone 14 Pro Max",
		description: "A new flagship phone by Apple!",
		price: 75000,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }) },
    	{
    		name: "USB to Type-C OTG",
		description: "Transfer files easily with the our on-the-go adapter",
		price: 50,
		isActive: true,
		createdOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
    	}
    ],
    	totalAmount: 75050,
    	purchasedOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
	}
]




var loggedUser

// create new product (admin only)
app.post('/create/products', (req, res) => {
  console.log(loggedUser);
  console.log(req.body);

  if (loggedUser.isAdmin === true) {
    // Check if the request body contains an array of products
    if (!Array.isArray(req.body)) {
      return res.status(400).send('Invalid request body. Expected an array of products.');
    }

    const newProducts = req.body.map((product) => {
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        isActive: product.isActive,
        createdOn: product.createdOn
      };
    });

    products.push(...newProducts);
    console.log(products);

    res.status(201).send('You have added new products!');
  } else {
    res.status(401).send('Unauthorized. Only admin users can add new products!');
  }
});

// show current products
app.get('/products', (req, res) => {
  console.log(loggedUser);
  res.send(products);
});

// Show all active products
app.get('/products/active', (req, res) => {
  console.log(loggedUser);
  let activeProducts = products.filter((product) => product.isActive === true);
  res.send(activeProducts);
});

// show a specific product by index
app.get('/products/:productId', (req, res) => {
  console.log(req.params);
  console.log(req.params.productId);
  let productId = parseInt(req.params.productId);
  if (productId >= 0 && productId < products.length) {
    let product = products[productId];
    res.send(product);
  } else {
    res.status(404).send('Invalid product ID.');
  }
});

// archive a product (admin only)
app.put('/products/archive/:productId', (req, res) => {
  console.log(req.params);
  console.log(req.params.productId);
  let productIndex = parseInt(req.params.productId);
  if (loggedUser.isAdmin === true) {
    if (productIndex >= 0 && productIndex < products.length) {
      products[productIndex].isActive = false;
      console.log(products[productIndex]);
      res.send('Product archived.');
    } else {
      res.status(404).send('Invalid product ID.');
    }
  } else {
    res.status(401).send('Unauthorized. Only admin users can archive products.');
  }
});

// reactivate the archived product (admin only)
app.put('/products/reactivate/:productId', (req, res) => {
  console.log(req.params);
  console.log(req.params.productId);
  let productIndex = parseInt(req.params.productId);
  if (loggedUser.isAdmin === true) {
    if (productIndex >= 0 && productIndex < products.length) {
      products[productIndex].isActive = true;
      console.log(products[productIndex]);
      res.send('Product reactivated.');
    } else {
      res.status(404).send('Invalid product ID.');
    }
  } else {
    res.status(401).send('Unauthorized. Only admin users can reactivate products.');
  }
});

// update a product (admin only)
app.put('/products/update/:productId', (req, res) => {
  console.log(req.params);
  console.log(req.params.productId);
  let productId = parseInt(req.params.productId);

  if (loggedUser.isAdmin === true) {
    if (productId >= 0 && productId < products.length) {
      let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        isActive: req.body.isActive,
        createdOn: req.body.createdOn,
      };
      products[productId] = updatedProduct;
      console.log(products[productId]);
      res.send('Product updated.');
    } else {
      res.status(404).send('Invalid product ID.');
    }
  } else {
    res.status(401).send('Unauthorized. Only admin users can update products.');
  }
});

// create new user
app.post('/create/user', (req, res) => {
  console.log(req.body);
  var newUser = {
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin === true || false // Convert string to boolean
  };
  users.push(newUser);
  loggedUser = newUser; // Update loggedUser with the new user
  console.log(users);
  res.status(201).send('Thank you for creating an account!');
});

// Promote a user to admin (admin only)
app.put('/users/promote/:userId', (req, res) => {
  console.log(req.params);
  console.log(req.params.userId);
  let userId = parseInt(req.params.userId);

  if (loggedUser.isAdmin === true) {
    if (userId >= 0 && userId < users.length) {
      users[userId].isAdmin = true;
      console.log(users[userId]);
      res.send('User promoted to admin.');
    } else {
      res.status(404).send('Invalid user ID.');
    }
  } else {
    res.status(401).send('Unauthorized. Only admin users can promote users.');
  }
});

// show current users (admin only)
app.get('/users', (req, res) => {
  console.log(loggedUser);

  if (loggedUser.isAdmin === true) {
    res.send(users);
  } else {
    res.status(401).send('Unauthorized. Only admin users can view users.');
  }
});

// create new order (non-admin only)
app.post('/create/orders', (req, res) => {
  console.log(req.body);
  if (loggedUser.isAdmin === false) {
    let newOrder = {
      userId: req.body.userId,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      purchasedOn: req.body.purchasedOn
    };
    order.push(newOrder);
    console.log(order);

    res.status(201).send('Order created successfully!');
  } else {
    res.status(401).send('Unauthorized. Only non-admin users can create an order.');
  }
});

// show all orders (admin only)
app.get('/users/orders', (req, res) => {
  console.log(loggedUser);
  if (loggedUser.isAdmin === true) {
    res.send(order);
  } else {
    res.status(401).send('Unauthorized. Only admin users can view orders.');
  }
});

// Show specific order by order ID (non-admin)
app.get('/orders/:userId', (req, res) => {
  console.log(req.params);
  console.log(req.params.userId);
  let userId = parseInt(req.params.userId);

  let selectedOrder = order.find((item) => item.userId === userId);

  if (selectedOrder) {
    if (loggedUser.isAdmin) {
      res.status(401).send('Unauthorized. Only non-admin users can view the specified order.');
    } else if (selectedOrder.userId === loggedUser.index) {
      res.send(selectedOrder);
    } else {
      res.status(401).send('Unauthorized. Only the user who placed the order can view it.');
    }
  } else {
    res.status(404).send('Order not found.');
  }
});

// update a specific order by index (non-admin)
app.put('/orders/:orderId', (req, res) => {
  console.log(req.params);
  console.log(req.params.orderId);
  let orderId = parseInt(req.params.orderId);

  if (orderId >= 0 && orderId < order.length) {
    let updatedOrder = {
      userId: order[orderId].userId,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      purchasedOn: order[orderId].purchasedOn
    };

    order[orderId] = updatedOrder;
    console.log(order[orderId]);
    res.send('Order updated successfully.');
  } else {
    res.status(404).send('Invalid order ID.');
  }
});

// Show the newly created order by its assigned userId
app.get('/new/orders/:userId', (req, res) => {
  console.log(loggedUser);
  if (loggedUser.isAdmin === false) {
    let userId = parseInt(req.params.userId);
    let newOrder= order.find((o) => o.userId === userId);  // Update the condition to check both userId and orderId
    if (newOrder) {
      res.send(newOrder);
    } else {
      res.status(404).send('Order not found.');
    }
  } else {
    res.status(401).send('Unauthorized. Only non-admin users can view their orders.');
  }
});

// Delete an order
app.delete('/orders/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);

  // Find the order by userId
  const foundOrder = order.find((order) => order.userId === userId);

  // If the order doesn't exist, return an error
  if (!foundOrder) {
    return res.status(404).send('Order not found.');
  }

  // Check if the logged-in user is authorized to delete the order
  // Assuming the user information is stored in the loggedUser object
  if (loggedUser.isAdmin) {
    return res.status(403).send('Unauthorized access. Only non-admin users can delete their own orders.');
  }

  // Check if the logged-in user is the owner of the order
  if (foundOrder.userId !== loggedUser.index) {
    return res.status(403).send('Unauthorized access. You can only delete your own orders.');
  }

  // Delete the order
  order = order.filter((order) => order.userId !== userId);

  return res.send('Order deleted successfully.');
});



// login
app.post('/users/login', (req, res) => {
  console.log(req.body);

  let foundUser = users.find((user) => {
    return user.email === req.body.email && user.password === req.body.password;
  });

  if (foundUser !== undefined) {
    let foundUserIndex = users.findIndex((user) => {
      return user.email === foundUser.email;
    });
    foundUser.index = foundUserIndex;
    loggedUser = foundUser;
    console.log(loggedUser);

    // Check if the user is an admin or non-admin
    if (foundUser.isAdmin) {
      console.log('User is an admin.');
    } else {
      console.log('User is a non-admin.');
    }

    return res.send({
      message: 'Thank you for logging in.',
      isAdmin: foundUser.isAdmin
    });
  } else {
    loggedUser = foundUser;
    return res.status(401).send('Login Failed. Wrong credentials!');
  }
});



app.listen(port, () => console.log(`Server is running at port ${port}`));
