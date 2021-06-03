const app = require('../../app');
const supertest = require('supertest');

describe('error handling', () => {
  test('302 Redirect status on GET /', async () => {
    await supertest(app).get('').expect(302)
  })

  test('404 on invalid /:shortlink', async () => {
    await supertest(app).get('/invalidShort').expect(404)
  })
})

describe('POST /', () => {
  test('create a new shortlink', async () => {
    const data = { original_link: 'https://jest-test.com' }

    await supertest(app)
      .post('/')
      .send(data)
      .expect(201)
      .then(async (response) => {
        expect(response.body.short_link)
        expect(response.body.delete_key)
      })
  })

  test('limit 5 req / 3 minutes', async () => {
    const data = { original_link: 'https://jest-test.com' }

    for (i = 0; i <= 6; i++) {
      await supertest(app).post('/').send(data)
    }
    await supertest(app).post('/').send(data).expect(429)
  })
})