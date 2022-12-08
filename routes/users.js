const router = require('express')
  .Router();

const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
