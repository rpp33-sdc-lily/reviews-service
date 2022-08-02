# About
A back end system was created to replace the existing API of the Atelier e-commerce website to meet the demands of increased production traffic. I was tasked with developing and deploying a microservice that handles CRUD operations for all existing and future reviews of products sold via Atelier.

The deployed reviews' microservice (with vertical scaling and Redis caching) is able to handle 1800 requests per second (RPS) with a 0% error rate. This is a 157% increase in performance and met the demand of the client.

# Routes

#### GET reviews for a product
`GET /reviews`<br>
 | Parameter      | Type |
| ----------- | ----------- |
| product_id | integer |
| page | integer |
| count | integer |
| sort | text |

#### GET reviews' metadata for a product
`GET /revies/meta`<br>
 | Parameter      | Type |
| ----------- | ----------- |
| product_id | integer |

#### POST reviews for a product
`GET /revies/meta`<br>
 | Parameter      | Type |
| ----------- | ----------- |
| product_id | integer |
| rating | integer |
| summary | text |
| body | text |
| recommend | boolean |
| name | text |
| email | text |
| photos | [text] |
| characteristics | object |

#### PUT to mark review as helpful
`PUT /reviews/:review_id/helpful`<br>
 | Parameter      | Type |
| ----------- | ----------- |
| review_id | integer |

#### PUT to report a review
`PUT /reviews/:review_id/report`<br>
 | Parameter      | Type |
| ----------- | ----------- |
| review_id | integer |

#Technologies
- Server
  - Node JS Express
- Database
  -PostgreSQL
- Deployment
  - AWS EC2 t2.medium instances
- Cache
  - Redis
- Monitoring Bottleneck Detection / Stress testing
  - K6
  - htop
  - Loader.io


