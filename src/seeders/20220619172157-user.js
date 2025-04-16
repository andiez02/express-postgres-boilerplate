const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('test1234', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        email: 'testuser@example.com',
        username: 'testuser',
        password: hashedPassword,
        role: 'member',
        is_verified: false, // dùng field snake_case
        token: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'users',
      {
        email: 'testuser@example.com',
      },
      {}
    );
  },
};
