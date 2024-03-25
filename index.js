const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to parse incoming request cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Work done");
});

app.get("/api", (req, res) => {
    try {
        const token = jwt.sign({
            name: "hamza",
            address: "kohat",
            _id: "576786892398"
        }, "secret");
        res.cookie("token", token, { httpOnly: true }); // Set token as httpOnly cookie
        return res.send("Token is created");
    } catch (error) {
        console.log(error);
        res.send("Not working");
    }
});

app.get("/done", authCheck, (req, res) => {
    res.send(`Authorized token ${req.user.name}`);
});

async function authCheck(req, res, next) {
    const cookieToken = req.cookies.token;
    if (!cookieToken) return res.redirect("/");

    try {
        const decodedToken = jwt.verify(cookieToken, "secret");

        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send("Token is invalid or expired");
    }
}

app.listen(3000, () => {
    console.log("Connected");
});
