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

router.get('/',[ensureAuthenticated, isAdmin, readAccessControl], async (req,res) =>{
    const perPage = 8;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage);

    const dept = await Department.find().skip(skip).limit(perPage);

    if (dept) {
        const pages = await Department.find().countDocuments();

        res.render('departments/index', {
            title: 'Departments',
            breadcrumbs: true,
            search_bar: true,
            dept: dept,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage)
        });
    } else if (dept) {
        res.render('departments/index', {
            title: 'department',
            breadcrumbs: true,
            search_bar: true,
            dept: dept
        });
    } else {
        req.flash('error_msg', 'No department found');
        res.redirect('/');
    }
})

router.post('/add',[ensureAuthenticated, isAdmin,  createAccessControl], async (req, res) =>{
    const dept = new Department({
        dcode:req.body.departmentCode,
        dname:req.body.departmentName
    });

    const result = await Department.findOne({
        'dcode':req.body.departmentCode
    });

    if(!result){
        try{
            const result = await dept.save();
            if (result) {
                req.flash('success_msg', 'Information saved successfully.');
                res.redirect('/departments');
            }
        } catch (ex) {
            for (field in ex.errors) {
                errors.push({
                    text: ex.errors[field].message
                });
                console.log(ex.errors[field]);
            }
            res.render('departments', {
                title: 'Add New Department',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }
    }
    else {
        req.flash('error_msg', 'Department Code already Exist');
        res.redirect('/departments');
    }
})

router.get('/add',[ensureAuthenticated, isAdmin, createAccessControl], async (req, res)=>{
    res.render('departments', {
        title: 'Add New Course',
        breadcrumbs: true,
        dept: dept
    });
})

router.delete('/delete/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await Department.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/departments');
    }
    else{
        req.flash('error_msg', 'OOPS!,Something Went Wrong!');
        res.send('/departments');
    }
});

module.exports = router;