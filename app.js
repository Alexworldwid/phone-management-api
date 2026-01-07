require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("node:path")
const homeRouter = require("./routes/homeRouter")
const phoneRouter = require('./routes/phoneRouter')
const categoriesRouter = require("./routes/categoriesRouter")

app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use("/", homeRouter);
app.use("/phones", phoneRouter);
app.use("/categories", categoriesRouter);

// error handler

app.use((err, req, res, next) => {
    const status = err.status || 500;

    res.status(status).render('partials/error', {
        status,
        message:
            process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
    })
})

app.listen(port, "0.0.0.0", () => {
    console.log(`server is running on port ${port}`)
})

