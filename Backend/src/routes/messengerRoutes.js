const express = require('express');
const router = express.Router();
const messengerController = require('../controllers/messengerController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/contacts', protect, messengerController.getContacts);
router.get('/recent', protect, messengerController.getRecentChats);
router.get('/history/:otherId/:otherType', protect, messengerController.getChatHistory);
router.post('/send', protect, upload.single('file'), messengerController.sendMessage);
router.put('/edit/:messageId', protect, messengerController.editMessage);
router.delete('/delete/:messageId', protect, messengerController.deleteMessage);
router.post('/star/:messageId', protect, messengerController.toggleStar);
router.post('/pin/:messageId', protect, messengerController.togglePin);

module.exports = router;
