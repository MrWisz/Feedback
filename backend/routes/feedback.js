const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { enviarFeedback, listarFeedbacks, miFeedback } = require('../controllers/feedbackController');


router.post('/', auth, enviarFeedback);
router.get('/', auth, listarFeedbacks)
router.get('/mine', auth, miFeedback);

module.exports = router;
