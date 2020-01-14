exports.up = function(knex) {
  console.log("UP: create comments table");
  return knex.schema.createTable("comments", function cb(commentsTable) {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").notNullable();
    commentsTable
      .integer("article_id")
      .references("articles.article_id")
      .onDelete("CASCADE");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.string("body");
  });
};

exports.down = function(knex) {
  console.log("DOWN: drop comments table");
  return knex.schema.dropTable("comments");
};
