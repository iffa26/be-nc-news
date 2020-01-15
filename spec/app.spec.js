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
  describe("/topics", () => {
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
  describe("/users/:username", () => {
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
  describe("/api/articles/:article_id", () => {
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
          expect(response.body.msg).to.equal("Bad Request: Invalid article_id");
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
  describe("/api/articles/:article_id", () => {
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
    // patch error handling
  });
});
