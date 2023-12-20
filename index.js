const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const path = require("path");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to list",
});
const item2 = new Item({
  name: "2nd todo list",
});
const item3 = new Item({
  name: "3rd todo list",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}).then((foundItems) => {
    if (foundItems.length === -1) {
      Item.insertMany(defaultItems)
      .then(function () {
        console.log("Successfully saved to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  
  const item = new Item({
    name: itemName,
  });
  
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
  .then(function () {
    console.log("Successfully deleted to DB");
    res.redirect("/");
  })
  .catch(function (err) {
    console.log(err);
  });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});
app.use(express.static("public"));

mongoose
.connect(`${process.env.MONGO_CONNECTION}`)
.then((result) => {
  console.log("Server started on port 3000");
  app.listen('3000');
})
.catch((err) => console.log(err));
