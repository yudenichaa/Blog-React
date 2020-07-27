const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jsonWebToken = require("jsonwebtoken");
const multer = require("multer");
const jsonParser = express.json();
const cookieParser = require('cookie-parser');
const app = express();

const appRoot = require('app-root-path');
const imageFolder = "/media"
const secretKey = "mysecretkey";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(appRoot.path, imageFolder);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const formData = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(null, false);
    }
});

const articleSchema = new Schema(
    {
        headline: {
            type: String,
            required: true,
            maxlength: 100
        },
        text: {
            type: String,
            required: true,
            maxlength: 5000
        },
        date: {
            type: Date,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    { versionKey: false });

const userSchema = new Schema(
    {
        login: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 16,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 16,
        },
        displayName: {
            type: String,
            required: true,
        }
    },
    { versionKey: false });

const Article = mongoose.model('Article', articleSchema);
const User = mongoose.model('User', userSchema);

mongoose.connect(
    "mongodb://localhost:27017/blog",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        app.listen(3000, () => {
            console.log("Server has started.");
        });
    })
    .catch(error => console.log(error));

app.delete("/api/articles/:id", (req, res) => {
    const id = req.params.id;
    Article.findOneAndDelete({ _id: id })
        .then(article => {
            const imageFilePath = path.join(appRoot.path, article.image);
            fs.unlink(imageFilePath, error => {
                if (error) console.log(error);
            });
            res.send(article);
        })
        .catch(error => console.log(error));
});


app.post("/api/articles", formData.single("image"), (req, res) => {
    if (!req.body || !req.file) {
        res.sendStatus(400);
        return;
    }
    const article = new Article({
        headline: req.body.headline,
        text: req.body.text,
        date: req.body.date,
        image: path.resolve(imageFolder, req.file.filename)
    });
    article.save()
        .then(() => res.send(article))
        .catch(error => console.log(error));
});

app.put("/api/articles", formData.single("image"), (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }

    const newArticle = {
        headline: req.body.headline,
        text: req.body.text,
        date: req.body.date
    }

    if (req.file) {
        Article.findById(req.body.id)
            .then(oldArticle => {
                const imageFilePath = path.join(appRoot.path, oldArticle.image);
                fs.unlink(imageFilePath, error => {
                    if (error) console.log(error);
                });
                newArticle.image = path.resolve(imageFolder, req.file.filename);
                Article.findByIdAndUpdate(
                    req.body.id,
                    newArticle,
                    { new: true })
                    .then(article => res.send(article))
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    }
    else {
        Article.findByIdAndUpdate(
            req.body.id,
            newArticle,
            { new: true })
            .then(article => res.send(article))
            .catch(error => console.log(error));
    }
});

app.post("/api/register", jsonParser, (req, res) => {
    const { login, password, displayName } = req.body;
    User.findOne({ login })
        .then(user => {
            if (user) res.status(409).json({
                error: "Login already exists"
            });
            else {
                const user = new User({ login, password, displayName });
                user.save()
                    .then(() => {
                        const payload = { login };
                        const token = jsonWebToken.sign(payload, secretKey, {
                            expiresIn: "1h",
                        });
                        res.cookie('token', token, { httpOnly: true })
                            .sendStatus(200);
                    })
                    .catch(error => { throw error; });
            }
        })
        .catch(_ => res.status(500).json({
            error: "Internal error, please try again"
        }));
});

app.post("/api/login", jsonParser, (req, res) => {
    const { login, password } = req.body;
    User.findOne({ login })
        .then(user => {
            if (!user || user.password != password) {
                res.status(401).json({
                    error: "Incorrect login or password"
                });
            }
            else {
                const payload = { login };
                const token = jsonWebToken.sign(payload, secretKey, {
                    expiresIn: '1h'
                });
                res.cookie('token', token, { httpOnly: true })
                    .sendStatus(200);
            }
        })
        .catch(_ => res.status(500).json({
            error: "Internal error, please try again"
        }));
});

const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({
            error: "Unauthorized: no token provided"
        });
    }
    else {
        jsonWebToken.verify(token, secretKey, (error, decoded) => {
            if (error) {
                res.status(401).json({
                    error: "Unauthorized: invalid token"
                });
            }
            else {
                req.login = decoded.login;
                next();
            }
        })
    }
};

app.get("/api/authenticate", cookieParser(), auth, (req, res) => {
    res.sendStatus(200);
});

app.get("/api/articles", (req, res) => {
    Article.find({})
        .then(articles => res.send(articles))
        .catch(error => console.log(error));
});

app.get("/api/article/:id", (req, res) => {
    const id = req.params.id;
    Article.findOne({ _id: id })
        .then(article => res.send(article))
        .catch(error => console.log(error));
});

app.use('/public', express.static(path.join(appRoot.path, "/public/")));

app.use('/static', express.static(path.join(appRoot.path, "/static/")));

app.use('/media', express.static(path.join(appRoot.path, "/media/")));

app.get("/*", (req, res) => {
    res.sendFile((path.join(appRoot.path, "/public/index.html")));
});