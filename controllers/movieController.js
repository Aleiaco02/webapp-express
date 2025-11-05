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

        const movies = result.map(movie => {
            return {
                ...movie,
                image: req.imagePath + movie.image
            }
        });

        // ritorniamo il risultato ottenuto
        res.json(movies);
    });
}


// SHOW
export function show(req, res) {
    // recuperiamo id da param
    const id = req.params.id;

    // prepariamo query per singolo film
    const moviesSql = `
    SELECT M.*, ROUND(AVG(R.vote)) AS average_vote
    FROM movies M
    LEFT JOIN reviews R
    ON R.movie_id = M.id
    WHERE M.id = ?
    `;

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

            singleMovies.average_vote = parseInt(singleMovies.average_vote);


            // ritorniamo il risultato ottenuto
            res.json(singleMovies);
        });
    });
}

export function store(req, res) {
    // recuperiamo id da param
    const id = req.params.id;

    // recuperiamo i dati nel body
    const { name, vote, text } = req.body;

    // prepariamo la query per la chiamata al DB
    const sql = 'INSERT INTO `reviews` (`name`, `vote`, `text`, `movie_id`) VALUES (?,?,?,?)';

    connection.query(sql, [name, vote, text, id], (err, result) => {
        // se c'è errore server DB
        if (err) return res.status(500).json({ error: 'Database query failed' });
        // se va tutto bene
        res.status(201);
        res.json({ id: result.insertId, message: 'Review added' });
    })


}