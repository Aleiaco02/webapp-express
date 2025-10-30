import express from 'express';
// import postsRouter from './routers/postsRouter.js';

// import middleware gestione errori
import errorsHandler from './middlewares/errorServer.js';
import notFound from './middlewares/notFound.js';

const app = express()
const port = 3000

// middleware static
app.use(express.static('public'));

// middleware bodyparser
app.use(express.json());

// rotta di partenza
app.get("/api", (req, res) => {
    res.send("ciao a tutti")
})

// utilizzo di router
// app.use("/posts", postsRouter);

// utilizzo middleware gestione errori
app.use(errorsHandler);
app.use(notFound);

app.listen(port, () => {
    console.log(`ascolto la porta ${port}`);
})