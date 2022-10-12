const seed = require("../db/seeds/seed");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app_connections/app");
const request = require("supertest");
const { convertTimestampToDate } = require("../db/seeds/utils");

beforeEach(() =>
  seed({
    categoryData,
    commentData,
    reviewData,
    userData,
  })
);

afterAll(() => db.end());

describe("GET /api/categories", () => {
  // an array of catagory objects, each should have a slug and description property
  //something like [{slug: 'something', description: "somthing"}, etc...]
  test("200: responds with a categories array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds when endpoint doesnt exist and/or is spelt wrong", () => {
    //categories is spelt wrong
    return request(app)
      .get("/api/catagories")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Page not found");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  /*this should return an object with all the relevent keys:
    review_id(num), title(str), review_body(str), designer(str), review_img_url(str), votes(num), category(referances the slug)(str), owner(referances a username)(str), created_at(num)
    */
  test("200: responds with the given object for the review at specified id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        const review = body[0];
        expect(review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("404: responds when at given id doesnt not exist", () => {
    return request(app)
      .get("/api/reviews/200")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("No review found for review_id: 200");
      });
  });
  test("400: responds when at given an invalid Id", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with a users array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        console.log(body);
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds when endpoint doesnt exist and/or is spelt wrong", () => {
    return request(app)
      .get("/api/sures")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Page not found");
      });
  });
});

describe.only("PATCH /api/reviews/:review_id", () => {
  /* request contains and Object {inc_votes : ${newVote}}
  {inc_votes: 2} should increment(positive number) or decrement(negitive number) the votes property at review_id by the newVote value(can just use addidtion becuase of negetive values)

  responce is the updated review ex( review_id: 2, votes: 3){{inc_votes: 2}} => (review_id: 2, votes: 5)
  */
  test("201: return with an updated votes key in given review object ", () => {
    const inc_vote = { inc_vote: 2 };
    return request(app)
      .patch("/api/reviews/2")
      .send(inc_vote)
      .expect(201)
      .then(({ body }) => {
        const { editedReview } = body;
        expect(body.msg).toBe("Votes on review 2 have changed from 5 to 7");
        expect(editedReview[0]).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("404: responds when at given id doesnt not exist", () => {
    const inc_vote = { inc_vote: 2 };
    return request(app)
      .patch("/api/reviews/200")
      .send(inc_vote)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("No review found for review_id: 200");
      });
  });
  test("400: responds when at given an invalid Id", () => {
    const inc_vote = { inc_vote: 2 };
    return request(app)
      .patch("/api/reviews/banana")
      .send(inc_vote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: responds when at given an invalid value for inc_vote", () => {
    const inc_vote = { inc_vote: "apple" };
    return request(app)
      .patch("/api/reviews/2")
      .send(inc_vote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: responds when at given an invalid key", () => {
    const inc_vote = { apple: 2 };
    return request(app)
      .patch("/api/reviews/2")
      .send(inc_vote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});
