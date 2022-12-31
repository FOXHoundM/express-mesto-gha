const router = require('express')
  .Router();

const {
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUserById);

router.patch('/me', updateUser);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
