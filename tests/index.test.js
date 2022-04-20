
const request = require('supertest');
const server = require('../server/index.js');

describe('Test API', () => {

  beforeAll(done => {
    done();
  });

  test('easy generic test on /', async() => {
    // await request(server).get(`/reviews/?page=1&count=2&sort='newest'&product_id=999997`)
    await request(server).get(`/`)
    .expect(200)
    .then((response) => {
      expect(response.text).toEqual('anything');
    });
  });

  test('Gets the test endpoint', (done) => {
    request(server)
      .get('/test')
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.message = 'passing the test!';
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  afterAll(done => {
    server.close();
    done();
  });
});


//previous method
// const supertest = require('supertest');

// describe('Test API', () => {
//   let app;

//   beforeEach(async() => {
//     app = require('../server/index.js');
//   });

//   test(('Gets the test endpoint'), async() => {

//     await supertest(app).get('/test')
//     .then(res => {
//       expect(res.status).toBe(200);
//       expect(res.body.message).toBe('passing the test!');
//     })
//   })
// });



// FIRST METHOD

// const app = require('../server/index.js');
// const supertest = require('supertest');
// const request = supertest(app);

// describe('GET/', () => {
//   let res;

//   beforeAll(async() => {
//     res = await request.get('/test')
//   });

//   it('Gets the test endpoint', async () => {
//     expect(res.status).toBe(200)
//     expect(res.body.message).toBe('passing the test!')
//   })

// })












