exports.up = function(knex) {
  console.log("UP: create topics table");
  return knex.schema.createTable("topics", function cb(topicsTable) {
    topicsTable
      .string("slug")
      .primary()
      .unique(); // slug is unique string, topics primary key
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("DOWN: drop topics table");
  return knex.schema.dropTable("topics");
};
