const express = require('express');
const APPS = require('./data');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']

app.get('/apps', (req, res) => {

    const { sort, genres } = req.query;
    let results = [...APPS]

    if (sort) {
        if (!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('Must sort by "Rating" or "App".');
        }
    }
    if (genres)
        results = results.filter(app =>
            app
                .Genres
                .toLowerCase()
                .includes(genres.toLowerCase()))
    if (sort) {
        if (sort === 'Rating') {
            results = results.sort((a, b) => {
                // return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
                return b[sort] - a[sort]
            })
        } else {
            results = results.sort((a, b) => {

                return a[sort].toUpperCase() > b[sort].toUpperCase() ? 1 : a[sort].toUpperCase() < b[sort].toUpperCase() ? -1 : 0;
                
            })
        }
    }

    res
        .json(results);

});

app.listen(8000, () => {
    console.log('Server is running on PORT 8000')
})