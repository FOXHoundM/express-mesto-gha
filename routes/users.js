const router = require('express')
  .Router();

const {
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
  getUserInfo,
} = require('../controllers/users');
const {
  validateGetUserId,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateGetUserId, getUserById);

router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, changeAvatar);

module.exports = router;
