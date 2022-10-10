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

describe("GET api/categories", () => {
  // an array of catagory objects, each should have a slug and description property
  //something like [{slug: 'something', description: "somthing"}, etc...]
  test("should ", () => {});
});
