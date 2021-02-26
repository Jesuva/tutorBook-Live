const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    formname: {
        type: String,
        required: true
    },
   formdata: {
       type : JSON,
       required:true,
   }
});

const Dynamicform = mongoose.model('Dynamicform', formSchema);
exports.Dynamicform = Dynamicform;