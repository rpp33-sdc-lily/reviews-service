const app = require('../server/index.js');
const supertest = require('supertest');
const request = supertest(app);

describe('GET/', () => {
  let res;

  beforeAll(async() => {
    res = await request.get('/test')
  });

  it('Gets the test endpoint', async () => {
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('passing the test!')
  })

})
