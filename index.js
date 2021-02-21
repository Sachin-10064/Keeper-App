const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost 27017/keeperDB", { useNewUrlParser: true, useUnifiedTopology: true });

const keeperSchema = {
    title: String,
    body: String
};

const Keeper = mongoose.model("Keeper", keeperSchema);


app.get("/", (req, res) => {
    Keeper.find({}, function (err, foundItem) {
        res.render("index", { notes: foundItem })
    });
});

app.post("/", (req, res) => {
    var note = new Keeper({
        title: req.body.Title,
        body: req.body.content
    });
    note.save();
    res.redirect("/");
});
app.post("/delete", (req, res) => {
    const checked = req.body.button;
    Keeper.findByIdAndRemove(checked, function (err) {
        if (!err) {
            console.log("deleted successfuly");
            res.redirect("/");
        }
    });
});

app.listen(port, () => {
    console.log("sever is running on port 3000");
});

