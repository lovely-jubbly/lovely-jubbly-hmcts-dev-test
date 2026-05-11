const prisma = require('../../src/lib/prisma');

async function resetDatabase() {
  await prisma.task.deleteMany();
}

module.exports = {
  resetDatabase,
};
