const mongoose = require('mongoose');

// Define models
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
});


// Attach some models

const Product = mongoose.model("Product", ProductSchema);

const demoMongoose = async () => {
  console.log('Connecting to mongo')
  const url = process.env.MONGO_URL;
  const userName = process.env.MONGO_USER;
  const password = process.env.MONGO_PASS;

  const connection = await mongoose.connect(url, {
    "authMechanism": "DEFAULT",
    "ssl": true,
    "sslCA": __dirname + "/rds-combined-ca-bundle.pem",
    "replicaSet": "rs0",
    "readPreference": "secondaryPreferred",
    "retryWrites": false,
    user: userName,
    pass: password
  });
  console.log('Connecting to mongo done')

  // Create product
  let product = new Product({ title: `Prod-${+(new Date())}` })
  await product.save()
  console.log("Product saved", product.id)

  // List products
  const products = await Product.find().exec()
  console.log("Products", products.length)

  for (const product of products) {
    console.log("Product", product.title)
  }

  // Query a single product by id
  product = await Product.findById("62e22cecda7bebe5ed31af67").exec()
  console.log("Queried Product", product)
  // product.title = "MyNewTitle"
  // await product.save()

  const productCount = await Product.count().exec()
  console.log("Product count", productCount)
  connection.disconnect()
}


const main = async () => await demoMongoose();

main()