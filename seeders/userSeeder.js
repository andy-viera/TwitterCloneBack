//node seeders/userSeeder.js

const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

faker.locale = "en";
module.exports = async () => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    users.push(
      new User({
        firstname,
        lastname,
        username: faker.internet.userName(firstname, lastname),
        password: await bcrypt.hash("1234", 10),
        email: faker.internet.exampleEmail(firstname, lastname),
        biography: faker.lorem.paragraph(),
        image: faker.image.avatar(),
      }),
    );
  }

  for (const user of users) {
    const randomFollowAmount = faker.datatype.number({ min: 0, max: users.length });
    for (let i = 0; i < randomFollowAmount; i++) {
      const randomUser = users[faker.datatype.number({ min: 0, max: users.length - 1 })];
      if (
        users.indexOf(randomUser) !== users.indexOf(user) &&
        !user.following.includes(randomUser._id)
      ) {
        user.following.push(randomUser._id);
        randomUser.followers.push(user._id);
        await randomUser.save();
      }
    }
    await user.save();
  }
};

console.log("[Database] Se corrió el seeder de Users.");
