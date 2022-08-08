const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://CustomDaddy001:CustomDaddy1234567@cluster0.ja4my.mongodb.net/todoDB", {
  useNewUrlParser: true
});

const workSchema = {
  name: String
};

const Item = mongoose.model("Item", workSchema);

const item1 = new Item({
  name: "Hello myself KJD"
});

const item2 = new Item({
  name: "Press the + Button to add new task."
});

const item3 = new Item({
  name: "Hope you will acomplissh your goals."
});

var readyItems = [item1, item2, item3];
var today;

const newSchema = {
  name: String,
  items: [workSchema]
}

const NewItem = mongoose.model("NewItem", newSchema);


app.get("/", function(req, res) {
   today = "Today"
  app.use(express.static(__dirname));


  Item.find({}, function(err, results) {
    if (results.length === 0) {
      Item.insertMany(readyItems, function(err) {
        if (err) {
          console.log("Error found");
        } else {
          console.log("Hogya Yay!, You did it.");
        }
      });
      res.redirect("/");
    } else {
      res.render("todo", {
        kday: today,
        itemlist: results
      });
    }
  });

});

app.post("/", function(req, res) {

  const newtask = req.body.task;
  const buttonvalue = req.body.button;


  const itemNew = new Item({
    name: newtask
  });


  if(buttonvalue === "Today"){
    itemNew.save();
    res.redirect("/");
  }else{
    NewItem.findOne({name: buttonvalue},function(err, list){
      list.items.push(itemNew);
      list.save();
      res.redirect("/"+buttonvalue);
    })
  }

});

app.post("/delete", function(req, res) {
  const checkedItem = req.body.checkbox;
const newname = req.body.newName;

  if(newname === "Today"){
  Item.findByIdAndRemove(checkedItem, function(err) {
    if (!err) {
      console.log("Mission accomplished");
      res.redirect("/");
    }
  });
}else{
  NewItem.findOne({name:newname}, function(err, foundList){
         foundList.items.pull({ _id: checkedItem });
         foundList.save();
             res.redirect("/" + newname);
         });
       };
 });

app.get("/doned", function(req, res) {
  app.use(express.static(__dirname));
  res.render("todo", {
    kday: "Task Done",
    itemlist: done
  })
})

app.post("/doned", function(req, res) {
  done.push(req.body.task);
  res.redirect("/doned");
})

app.get("/:pagename",function(req, res){
  const page = req.params.pagename;

  NewItem.findOne({name: page}, function(err, fl){
    if(!err){
      if(!fl){
        const list = new NewItem({
          name: page,
          items: readyItems
        })
        list.save();
        res.redirect("/"+page);
      }else{
        res.render("todo", {
          kday: page,
          itemlist: fl.items
        })
      }
    }
  })
});

app.listen((process.env.PORT || 1111), function() {
  console.log("Server Started Pancho");
});
