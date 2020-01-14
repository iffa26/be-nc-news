exports.up = function(knex) {
  console.log("UP: create users table");
  return knex.schema.createTable("users", function cb(usersTable) {
    usersTable
      .string("username")
      .primary()
      .unique();
    usersTable.string("avatar_url");
    usersTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  console.log("DOWN: drop users table");
  return knex.schema.dropTable("users");
};
