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

          const output = response.body.topics.every(topic => {
            return topic.slug && topic.description;
          });
          expect(output).to.be.true;
        });
    });
    it("PATCH, POST, PUT, DELETE: 405 Method not allowed", () => {
      return request(app)
        .patch("/api/topics")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  describe("GET /users/:username", () => {
    it("GET:200 responds with an user object which should have properties username, avatar_url, name", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(response => {
          expect(response.body.user).to.be.an("object");
          expect(response.body.user).to.have.keys(
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
          expect(response.body.article).to.be.an("object");
          expect(response.body.article).to.contain.keys(
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
    it("PATCH:201 Created responds with the updated article object, where inc_votes is > 0", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 10 })
        .expect(201)
        .then(response => {
          expect(response.body.article).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(response.body.article.votes).to.equal(10);
        });
    });
    it("PATCH:201 Created responds with the updated article object, where inc_votes is < 0", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: -10 })
        .expect(201)
        .then(response => {
          expect(response.body.article).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(response.body.article.votes).to.equal(-10);
        });
    });
    it("PATCH:200 responds with the unchanged article object when body is empty", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(response.body.article.votes).to.equal(0);
        });
    });
    it("PATCH:200 responds with the unchanged article object when inc_votes is misspelt", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ incVotes: 2 })
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(response.body.article.votes).to.equal(100);
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
        .send({ username: "rogersop", body: "this is so fun" })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.be.an("object");
          expect(response.body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.body).to.equal("this is so fun");
          expect(response.body.comment.article_id).to.equal(1);
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
        .send({ username: "rogersop" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Incomplete body");
        });
    });
    it("POST:400 Bad Request when body is empty in request", () => {
      return request(app)
        .post("/api/articles/7/comments")
        .send({ username: "rogersop", body: "" })
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
    it("POST:404 Not Found when username does not exist (invalid)", () => {
      return request(app)
        .post("/api/articles/7/comments")
        .send({ username: "iffa", body: "lol" })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: Resource does not exist"
          );
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
        .send({ username: "rogersop", body: "amazing" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
  });
  describe("GET /articles/:article_id/comments", () => {
    it("GET:200 responds with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.an("array");
          const output = response.body.comments.every(comment => {
            return (
              comment.comment_id &&
              comment.votes &&
              comment.created_at &&
              comment.author &&
              comment.body
            );
          });
          expect(output).to.be.true;
        });
    });
    it("GET:200 responds with defualt sort criteria (by created_at in descending order)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET:200 responds with comments sorted by votes", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=votes")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("GET:200 responds with comments sorted by author", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=author")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("author", {
            descending: true
          });
        });
    });
    it("GET:200 responds with comments sorted by body", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=body")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("body", {
            descending: true
          });
        });
    });
    it("GET:200 responds with comments sorted by comment_id", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=comment_id")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("comment_id", {
            descending: true
          });
        });
    });
    it("GET:200 responds with comments sorted in ascending order", () => {
      return request(app)
        .get("/api/articles/9/comments?order=asc")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("created_at", {
            descending: false
          });
        });
    });
    it("GET:200 responds with comments sorted by votes in ascending order", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("votes", {
            descending: false
          });
        });
    });
    it("GET:400 when sort_by column is invalid", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=invalidColumn")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid column name");
        });
    });
    it("GET:400 when order option is invalid", () => {
      return request(app)
        .get("/api/articles/9/comments?order=invalidOption")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid order option");
        });
    });
    it("GET:400 Bad Request on article_id which is invalid", () => {
      return request(app)
        .get("/api/articles/notAnArticleID/comments?sort_by=votes&order=asc")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
    it("GET:404 Not Found on article_id which doesnt exist", () => {
      return request(app)
        .get("/api/articles/10000/comments?sort_by=votes&order=asc")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: article_id does not exist"
          );
        });
    });
    it("GET:200 reponds with an empty array where the article_id exists, but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.an("array");
          expect(response.body.comments.length).to.equal(0);
        });
    });
  });
  describe("GET /api/articles", () => {
    it("**GET:200 responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an("array");
          expect(response.body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET:200 responds with an array of article objects, sorted in default order (by created_at, desc)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET:200 responds with an array of article objects, filtered by author", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(response => {
          const output = response.body.articles.every(article => {
            return article.author === "rogersop";
          });
          expect(output).to.be.true;
        });
    });
    it("GET:200 responds with an array of article objects, filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(response => {
          const output = response.body.articles.every(article => {
            return article.topic === "cats";
          });
          expect(output).to.be.true;
        });
    });
    it("GET:200 responds with an array of article objects, filtered by author and topic", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars&topic=mitch")
        .expect(200)
        .then(response => {
          const output = response.body.articles.every(article => {
            return (
              article.topic === "mitch" && article.author === "icellusedkars"
            );
          });
          expect(output).to.be.true;
        });
    });
    it("GET:400 when sort_by column is invalid", () => {
      return request(app)
        .get("/api/articles/?sort_by=invalidColumn")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid column name");
        });
    });
    it("GET:400 when order option is invalid", () => {
      return request(app)
        .get("/api/articles/?order=invalidOption")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid order option");
        });
    });
    it("GET:200 reponds with an empty array when author is a valid user but doesnt have any articles", () => {
      return request(app)
        .get("/api/articles/?author=lurker")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an("array");
          expect(response.body.articles.length).to.equal(0);
        });
    });
    it("POST:404 Not Found when username does not exist (invalid)", () => {
      return request(app)
        .get("/api/articles/?author=iffa")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: Resource does not exist"
          );
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    it("PATCH:201 Created responds with the updated comment object, when inc_votes is > 0", () => {
      return request(app)
        .patch("/api/comments/14")
        .send({ inc_votes: 1 })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.be.an("object");
          expect(response.body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.votes).to.equal(17);
        });
    });
    it("PATCH:201 Created responds with the updated comment object, when inc_votes is < 0", () => {
      return request(app)
        .patch("/api/comments/14")
        .send({ inc_votes: -1 })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.be.an("object");
          expect(response.body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.votes).to.equal(15);
        });
    });
    it("PATCH:200 responds with the unchanged comment object when request body is empty", () => {
      return request(app)
        .patch("/api/comments/14")
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.be.an("object");
          expect(response.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.votes).to.equal(16);
        });
    });
    it("PATCH:200 responds with the unchanged comment object when inc_votes is misspelt", () => {
      return request(app)
        .patch("/api/comments/14")
        .send({ incVotes: 2 })
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.be.an("object");
          expect(response.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.votes).to.equal(16);
        });
    });
    it("PATCH:404 Not Found on comment_id which does not exist", () => {
      return request(app)
        .patch("/api/comments/10000")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: comment_id does not exist"
          );
        });
    });
    it("PATCH:400 Bad Request on invalid comment_id", () => {
      return request(app)
        .patch("/api/comments/notACommentID")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
    it("PATCH:400 Bad Request on invalid request type", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: "invalidType" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    it("DELETE:204 responds with no content and deletes the given comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
    it("DELETE:404 Not Found on comment_id which does not exist", () => {
      return request(app)
        .delete("/api/comments/10000")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Not Found: comment_id does not exist"
          );
        });
    });
    it("DELETE:400 Bad Request on invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/notACommentID")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request: Invalid data type");
        });
    });
  });
  describe("405 errors on all endpoints", () => {
    it("responds with a 405 on methods which aren't allowed", () => {
      return request(app)
        .patch("/api/articles/")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  // describe("***GET /api", () => {
  //   xit("GET:200 responds with a JSON describing all the available endpoints on your API", () => {});
  // });
});
