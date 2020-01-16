process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
chai.use(chaiSorted);
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection.js");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("GET /topics", () => {
    it("GET:200 responds with a topics array of objects, which each have a slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          expect(response.body.topics).to.be.an("array");
          expect(response.body.topics[0]).to.have.keys("slug", "description");
        });
    });
  });
  describe("GET /users/:username", () => {
    it("GET:200 responds with an user object which should have properties username, avatar_url, name", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(response => {
          expect(response.body.user).to.be.an("array");
          expect(response.body.user[0]).to.have.keys(
            "username",
            "avatar_url",
            "name"
          );
        });
    });
    it("GET:404 Not Found on username which doesnt exist", () => {
      return request(app)
        .get("/api/users/thisUsernameDoesNotExist_123")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Username does not exist");
        });
    });
  });
  describe("GET /articles/:article_id", () => {
    it("GET:200 responds with an article object with article keys including a comment_count key", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("array");
          expect(response.body.article.length).to.equal(1);
          expect(response.body.article[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET:400 Bad Request on article_id which is invalid", () => {
      return request(app)
        .get("/api/articles/notAnArticleID")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
    it("GET:404 Not Found on article_id which doesnt exist", () => {
      return request(app)
        .get("/api/articles/10000")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: article_id does not exist"
          );
        });
    });
  });
  describe("PATCH /articles/:article_id", () => {
    it("PATCH:200 responds with the updated article object in an array", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("array");
          expect(response.body.article[0].votes).to.equal(10);
        });
    });
    it("PATCH:404 Not Found on article_id which does not exist", () => {
      return request(app)
        .patch("/api/articles/10000")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: article_id does not exist"
          );
        });
    });
    it("PATCH:400 Bad Request on invalid article_id", () => {
      return request(app)
        .patch("/api/articles/notAnArticleID")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
    it("PATCH:400 Bad Request on missing inc_votes request field", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Bad Request: Missing request field"
          );
        });
    });
    it("PATCH:400 Bad Request on mispelt inc_votes request field", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ incVotes: 2 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Bad Request: Missing request field"
          );
        });
    });
    it("PATCH:400 Bad Request on invalid request type", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "invalidType" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
  });
  describe("POST /articles/:article_id/comments", () => {
    it("POST:201 Created reponds with the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "iffa26", body: "this is so fun" })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.be.an("array");
          expect(response.body.comment.length).to.equal(1);
          expect(response.body.comment[0]).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment[0].body).to.equal("this is so fun");
          expect(response.body.comment[0].article_id).to.equal(1);
        });
    });
    it("POST:400 Bad Request when username is not passed in request", () => {
      return request(app)
        .post("/api/articles/4/comments")
        .send({ body: "omg wow" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Incomplete body");
        });
    });
    it("POST:400 Bad Request when body is not passed in request", () => {
      return request(app)
        .post("/api/articles/4/comments")
        .send({ username: "iffa" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Incomplete body");
        });
    });
    it("POST:400 Bad Request when body is empty in request", () => {
      return request(app)
        .post("/api/articles/7/comments")
        .send({ username: "iffa", body: "" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Incomplete request");
        });
    });
    it("POST:400 Bad Request when username is empty in request", () => {
      return request(app)
        .post("/api/articles/7/comments")
        .send({ username: "", body: "lol" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Incomplete request");
        });
    });

    it("POST:404 Not Found when article_id does not exist", () => {
      return request(app)
        .post("/api/articles/300000/comments")
        .send({ username: "iffa", body: "amazing" })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: Resource does not exist"
          );
        });
    });
    it("POST:400 Bad Request when article_id is invalid data type", () => {
      return request(app)
        .post("/api/articles/not_an_id/comments")
        .send({ username: "iffa", body: "amazing" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
  });
});
