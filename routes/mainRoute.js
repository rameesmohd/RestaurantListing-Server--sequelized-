const express = require('express')
const router = express.Router()
const mainController = require('../controller/mainController')
const multer = require('../config/multer')
const upload = multer.createMulter()

router.route('/')
    .get(mainController.fetchData)
    .post(upload.fields([{name:'image'}]),mainController.addData)
    .patch(upload.fields([{name:'image'}]),mainController.updateData)
    .delete(mainController.deleteData)

module.exports = router