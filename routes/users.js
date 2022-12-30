const router = require('express')
  .Router();

const {
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
  getUserInfo,
} = require('../controllers/users');
const { validateUserId, validateUserInfo, validateAvatarUpdate } = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUserInfo, updateUser);
router.patch('/me/avatar', validateAvatarUpdate, changeAvatar);

module.exports = router;
