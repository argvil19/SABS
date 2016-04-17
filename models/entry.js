'use strict';

var mongoose = require('mongoose');

var entrySchema = mongoose.Schema({
    title:String,
    author:String,
    date:{
        type:Number,
        default:Date.now()
    },
    content:String,
    abstract:String,
    tags:Array,
    comments:[],
    votes:{
        totalVotes:{
            default:0,
            type:Number
        },
        voters:[]
    }
});

module.exports = mongoose.model('Entry', entrySchema, 'entries');