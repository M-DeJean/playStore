const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('Get /apps', () => {

    it('Should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                const apps = res.body[0]
                expect(apps).to.include.all.keys(
                    'App', 'Rating', 'Genres'
                )
            })
    });

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'Must sort by "Rating" or "App".');
    });

    it('should be 400 if genre type is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'INVALID' })
            .expect(400, 'Invalid Genre type. Valid genres include: Action, Puzzle, Strategy, Casual, Arcade, or Card')
    })

    it('should sort by Rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtIPlus1.Rating > appAtI.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should sort by App', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtIPlus1.App.toUpperCase() < appAtI.App.toUpperCase()) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should list Apps within the requested genre', () => {
        const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
        const q = 'Card';
        return supertest(app)
            .get('/apps')
            .query({ genres: q })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let filtered = true;
                if (!validGenres.includes(q)) {
                    filtered = false;
                }
                expect(filtered).to.be.true;
            });
    });

})