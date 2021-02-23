const express = require('express');
const faker = require('faker');
const moment = require('moment');
const randomString = require('randomstring');

const router = express.Router();

const {
    Department
} = require('../models/department');

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

router.get('/',[ ensureAuthenticated, isAdmin, readAccessControl ], async(req,res) => {
    res.render('forms/index', {
        title: 'Create Form',
        breadcrumbs: true,
    });
})



module.exports = router;