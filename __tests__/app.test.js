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
