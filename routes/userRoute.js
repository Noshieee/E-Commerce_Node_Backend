const express = require('express')
const router = express.Router()
//GET ALL
router.get('/', (req, res) => {
    res.json(users)
})

//GET ONE

module.exports = router