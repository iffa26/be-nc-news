const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).to.deep.equal([]);
  });
  it("returns an array of a single object with formatted date, when passes an array with a single object", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(input);
    expect(output[0].created_at instanceof Date).to.be.true;
  });
  it("returns an array of objects with the formatted date, when passed an array with multiple objects", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      }
    ];
    const output = formatDates(input);
    const outputTest = output.every(article => {
      return article.created_at instanceof Date === true;
    });
    expect(outputTest).to.be.true;
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const inputCopy = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);
    expect(input).to.not.equal(inputCopy); // different reference
    expect(input).to.deep.equal(inputCopy); // same value
    expect(input[0]).to.deep.equal(inputCopy[0]);
    expect(input[0]).to.not.equal(inputCopy[0]);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("retuns a reference object when passed a single object array", () => {
    const input = [{ article_id: 1, title: "A" }];
    const expectedOutput = { A: 1 };
    expect(makeRefObj(input)).to.deep.equal(expectedOutput);
  });
  it("returns a reference object when passed an array with mutliple objects", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const expectedOutput = { A: 1, B: 2, C: 3 };
    expect(makeRefObj(input)).to.deep.equal(expectedOutput);
  });
  it("does not mutate the input array", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const inputCopy = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    makeRefObj(input);
    expect(input).to.equal(input);
    expect(input).to.deep.equal(inputCopy);
    expect(input[0]).to.deep.equal(inputCopy[0]);
    expect(input[0]).to.not.equal(inputCopy[0]);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array or empty reference object", () => {
    expect(formatComments([{ non: "toto" }], [])).to.deep.equal([]);
  });
  it("returns a formatted comment when passed an array with a single object", () => {
    const inputComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const inputRefObj = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
      "Student SUES Mitch!": 4,
      "UNCOVERED: catspiracy to bring down democracy": 5,
      A: 6,
      Z: 7,
      "Does Mitch predate civilisation?": 8,
      "They're not exactly dogs, are they?": 9,
      "Seven inspirational thought leaders from Manchester UK": 10,
      "Am I a cat?": 11,
      Moustache: 12
    };
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    expect(formatComments(inputComments, inputRefObj)).to.deep.equal(
      expectedOutput
    );
  });
  it("returns an array of formatted comments when passed an array with multiple objects", () => {
    const inputComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];

    const inputRefObj = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
      "Student SUES Mitch!": 4,
      "UNCOVERED: catspiracy to bring down democracy": 5,
      A: 6,
      Z: 7,
      "Does Mitch predate civilisation?": 8,
      "They're not exactly dogs, are they?": 9,
      "Seven inspirational thought leaders from Manchester UK": 10,
      "Am I a cat?": 11,
      Moustache: 12
    };

    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        article_id: 1,
        author: "icellusedkars",
        votes: -100,
        created_at: new Date(1416746163389)
      }
    ];
    expect(formatComments(inputComments, inputRefObj)).to.deep.equal(
      expectedOutput
    );
  });
  it("does not mutate the input array", () => {
    const inputComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const inputRefObj = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
      "Student SUES Mitch!": 4,
      "UNCOVERED: catspiracy to bring down democracy": 5,
      A: 6,
      Z: 7,
      "Does Mitch predate civilisation?": 8,
      "They're not exactly dogs, are they?": 9,
      "Seven inspirational thought leaders from Manchester UK": 10,
      "Am I a cat?": 11,
      Moustache: 12
    };
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    const inputCommentsCopy = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    formatComments(inputComments, inputRefObj);
    expect(inputComments).to.equal(inputComments);
    expect(inputComments).to.deep.equal(inputComments);
    expect(inputComments).to.deep.equal(inputCommentsCopy);
    expect(inputComments[0]).to.deep.equal(inputCommentsCopy[0]);
    expect(inputComments[0]).to.not.equal(inputCommentsCopy[0]);
  });
});
