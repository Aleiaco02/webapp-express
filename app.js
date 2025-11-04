import express from 'express';
import movieRouters from './routers/movieRouters.js';
import cors from "cors";

// import middleware gestione errori
import errorsHandler from './middlewares/errorServer.js';
import notFound from './middlewares/notFound.js';

// import middlware gestione immagini 
import setImagePath from './middlewares/imagePath.js';

const app = express()
const port = 3000

// middleware static
app.use(express.static('public'));

// middleware bodyparser
app.use(express.json());

// utilizzo middleware getione immagini
app.use(setImagePath);

app.use(cors({
    origin: process.env.FE_APP
}));

// rotta di partenza
app.get("/api", (req, res) => {
    res.send("ciao a tutti")
})

// utilizzo di router
app.use("/api/movies", movieRouters);

// utilizzo middleware gestione errori
app.use(errorsHandler);
app.use(notFound);


app.listen(port, () => {
    console.log(`ascolto la porta ${port}`);
})