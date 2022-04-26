import http from "k6/http";
import { check, sleep } from "k6";

const API_URL = 'http://localhost:5000/';

export let options = {
  vus: 75000,
  duration: '30s'
};


function generateRandom(min = 0, max = 100) {
  // find diff
  let difference = max - min;
  // generate random number
  let rand = Math.random();
  // multiply with difference
  rand = Math.floor( rand * difference);
  // add with min value
  rand = rand + min;
  return rand;
}

export default function () {
  var id= generateRandom(900010, 1000011);
  // console.log('id', id);

  let getProductReviews = http.get(`http://localhost:5000/reviews/?page=1&count=100000&sort='newest'&product_id=${id}`);
  check(
    getProductReviews,
    { "Get product reviews status code is 200": (r) => r.status == 200 }
  );
  // let getMetaData = http.get(`http://localhost:5000/reviews/meta?product_id=${id}`);
  // check(
  //   getMetaData,
  //   { "Get product meta data status code is 200": (r) => r.status == 200 }
  // );

}

