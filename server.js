const express = require('express');
const path = require('path');
const fs = require("fs")
const uniqid = require("uniqid")
let database = require("./db/db.json")
const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
///app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get("/api/notes", (req, res) => {
    res.json(database)
})


app.post("/api/notes", (req, res) => {
    var noteDetails = req.body
    noteDetails.id = uniqid()
    database.push(noteDetails)
    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(database))
    res.json()
})

app.delete("/api/notes/:id", (req, res) => {
    var id = req.params.id
    var filterDb = database.filter(note => {
        return note.id !== id
    })

    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(filterDb))
    database = filterDb
    res.json()
})



app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
