// Importiamo il file di connessione al database
import connection from '../data/db.js';

// INDEX
export function index(req, res) {
    // impostiamo la query
    const sql = 'SELECT * FROM movies';

    // aggiungiamo la connessione per la richiesta
    connection.query(sql, (err, result) => {
        // gestiamo errore server mysql
        if (err) return res.status(500).json({ error: "Database error" });
        // ritorniamo il risultato ottenuto
        res.json(result);
    });
}

// SHOW
export function show(req, res) {
    // recuperiamo id da param
    const id = req.params.id;

    // prepariamo query per singolo film
    const moviesSql = 'SELECT * FROM movies WHERE id = ?';

    // prepariamo la query per reviews del film
    const reviewSql = 'SELECT * FROM reviews WHERE movie_id = ?';

    // aggiungiamo la connessione per la richiesta
    connection.query(moviesSql, [id], (err, moviesResult) => {
        // gestiamo errore server mysql
        if (err) return res.status(500).json({ error: "Database error" });
        // gestiamo anche il 404
        if (moviesResult.length === 0)
            return res.status(404).json({ error: "Movie not found" });

        // creiamo oggetto singolo film
        const singleMovies = moviesResult[0];
        singleMovies.image = req.imagePath + singleMovies.image;

        // aggiungiamo connessione per richiesta reviews relative
        connection.query(reviewSql, [id], (err, reviewResult) => {
            // gestiamo errore server mysql
            if (err) return res.status(500).json({ error: "Database error" });
            // aggiungiamo le reviews sull'oggetto del singolo film
            singleMovies.reviews = reviewResult;

            // ritorniamo il risultato ottenuto
            res.json(singleMovies);
        });
    });
}
