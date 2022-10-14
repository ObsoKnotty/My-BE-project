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
          comment_count: expect.any(Number),
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

describe("PATCH /api/reviews/:review_id", () => {
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

describe("GET /api/reviews", () => {
  test("200: responds with a reviews array", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
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
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: responds with a reviews array where the reviews are only of the requested category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(1);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: "dexterity",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  describe("GET /api/reviews?(sort_by or order)=$query", () => {
    test("user should be able to request the order by which the result is sorted ", () => {
      return request(app)
        .get("/api/reviews?sort_by=owner")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("owner", { descending: true });
        });
    });
    test("user should be able to request the order by which the result is sorted ", () => {
      return request(app)
        .get("/api/reviews?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("title", { descending: true });
        });
    });
    test("400: invalid sort_by query value", () => {
      return request(app)
        .get("/api/reviews?sort_by=banana")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("invalid value given");
        });
    });
    test("user needs to be able to query for descending", () => {
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("created_at", { ascending: true });
        });
    });
    test("400: invalid order query value", () => {
      return request(app)
        .get("/api/reviews?order=banana")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("invalid value given");
        });
    });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200 return  an array of comments for the given review id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        const date1 = new Date(comments[0].created_at).getTime();
        const date2 = new Date(comments[1].created_at).getTime();
        expect(date1 > date2).toBe(true);
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            review_id: 2,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("404: responds when at given id doesnt not exist", () => {
    return request(app)
      .get("/api/reviews/200/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("No comments found for review_id: 200");
      });
  });
  test("400: responds when at given an invalid Id", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: responds when given endpoint doesnt not exist", () => {
    return request(app)
      .get("/api/reviews/2/commens")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Page not found");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: should accept an object with a username and body keys as properties and return with the posted comment", () => {
    const newComment = { username: "bainesface", body: "Best game ever!" };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.length).toBe(1);
        expect(comment[0]).toMatchObject({
          comment_id: 7,
          body: "Best game ever!",
          review_id: 2,
          author: "bainesface",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("400: should respond with server error if username does not exist in the system", () => {
    const newComment = { username: "O", body: "Best game ever!" };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid username");
      });
  });
});

describe.only("DELETE /api/comments/:comment_id", () => {
  test("204: No content status", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then((body) => {
        const { statusMessage } = body.res;
        expect(statusMessage).toBe("No Content");
      });
  });
  test("404: when no comment found", () => {
    return request(app)
      .delete("/api/comments/45")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe(`No comment with id 45 found for deletion`);
      });
  });
});
