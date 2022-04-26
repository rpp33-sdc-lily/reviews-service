
const request = require('supertest');
const server = require('../server/index.js');

describe('Test API', () => {

  beforeAll(done => {
    done();
  });

  test('easy generic test on /', async() => {
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

  describe('Test the get /reviews/ route', ()=>{
    test('Sending request with appropriate params', async() => {
      await request(server).get(`/reviews/?page=1&count=2&sort='newest'&product_id=999997`)
      .expect(200)
    });

    test('Sending request without appropriate params', async() => {
      await request(server).get(`/reviews/?page=1&count=2&sort='newest'&product_id=u`)
      .expect(500)
      .then((response) => {
        expect(response.body.message).toEqual('error in getting reviews');
      });
    });
  });

  describe('Test the get /reviews/meta route', ()=>{
    test('Sending request with appropriate params', async() => {
      await request(server).get(`/reviews/meta?product_id=64630`)
      .expect(200)
    });

    test('Sending request without appropriate params', async() => {
      await request(server).get(`/reviews/meta?product_id=`)
      .expect(500)
      .then((response) => {
        expect(response.body.message).toEqual('error in getting meta data');
      });
    });
  });

  describe('Test the route to mark a review as helpful', ()=>{
    test('Sending request with appropriate params', async() => {
      await request(server).put(`/reviews/5730370/helpful`)
      .expect(204)
    });

    test('Sending request without appropriate params', async() => {
      await request(server).put(`/reviews/m/helpful`)
      .expect(500)
    });
  });

  describe('Test the route to report a review', ()=>{
    test('Sending request with appropriate params', async() => {
      await request(server).put(`/reviews/5730371/report`)
      .expect(204)
    });

    test('Sending request without appropriate params', async() => {
      await request(server).put(`/reviews/m/report`)
      .expect(500)
    });
  });

  // describe('Test the route to post a review', ()=>{
  //   test('Sending request with appropriate data', async() => {
  //     const goodData = {
  //       'product_id': 3,
  //       'rating': 2,
  //       'summary': "meh product",
  //       'body': "dooop I wasn't susafre if I'd like the prasdfoduct or not but I ended up loving it!",
  //       'recommend': true,
  //       'name': "Nagano",
  //       'email': "clubz@gmail.com",
  //       'characteristics': '{ "6": 3, "7": 1, "8": 4, "9": 3 }',
  //       'photos': '["https://images.unsplash.com/photo-1517278322228-3fe7a86cf6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80", "https://images.unsplash.com/photo-1507920676663-3b72429774ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80", "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1511&q=80"]'
  //     }
  //     await request(server).post(`/reviews`)
  //     .send(goodData)
  //     .expect(201)
  //   });

  //   test('Sending request without appropriate data', async() => {
  //     await request(server).put(`/reviews/m/report`)
  //     .expect(500)
  //   });
  // });


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












