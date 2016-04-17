var Entry = require('../../models/entry');
var checkUser = require('../checkUserLevel');
var handleRes = require('../response/handleRes');
var mongoose = require('mongoose');

function genHexNum() {
    'use strict';
    
    var hex = [];
    var possible = ['0', '1', '2', '3', '4', '5','6','7','8','9','a','b','c','d','e','f'];
    
    for (var i=0;hex.length<16;i++) {
        hex.push(Math.floor(Math.random()*possible.length));
    }
    
    return hex.join('');
    
};

module.exports = function(app) {
    
    /* Routes for handling entries requests */
    
    app.get('/api/entry/', function(req, res) {
        
        /* Sends all the entries in the DB */
        
        Entry.find({}, {__v:0}, function(err, data) {
            if (err)
                throw err;
            res.send(data);
        });
        
    });
    
    app.get('/api/entry/:id', function(req, res) {
        
        /* Sends an specific entry data */
        
        Entry.findOne({_id:req.params.id}, function(err, data) {
            if (err) {
                throw err;
            }
            if (data) {
                return res.status(200).send(data);
            } else {
                return handleRes(res, 200, 'No entry found', true);
            }
        });
        
    });
    
    app.post('/api/entry/', checkUser, function(req, res) {
        
        /* Create a new entry in DB. Only for admins */
        
        if (req.user.userLevel !== 2)
            return handleRes(res, 403, 'Unauthorized', true);
        
        var newEntry = new Entry();
        
        newEntry.title = req.body.title;
        newEntry.author = req.body.author;
        newEntry.tags = req.body.tags;
        newEntry.abstract = req.body.abstract;
        newEntry.content = req.body.content;
        
        newEntry.save(function(err, data) {
            if (err)
                throw err;
            return handleRes(res, 201, 'Your entry has been added', false);
        });
        
    });
    
    app.put('/api/entry/:id', checkUser, function(req, res) {
        
        /* Modifies an entry. Only for admins */
        
        if (req.user.userLevel !== 2)
            return handleRes(res, 403, 'Unauthorized', true);
        
        Entry.update({_id:req.params.id}, {
            content:req.body.content,
            tags:req.body.tags,
            title:req.body.title,
            abstract:req.body.abstract
        }, function(err, data) {
            if (err)
                throw err;
            return handleRes(res, 200, 'Your entry has been modified', false);
        });
        
    });
    
    app.delete('/api/entry/:id', function(req, res, next) {
        
        /* Delete an entry. Only for admins */
        
        if (req.user.userLevel !== 2)
            return handleRes(res, 403, 'Unauthorized', true);
            
        
        if (req.params.id === "post")
            return next();
        
        Entry.remove({_id:req.params.id}, function(err, data) {
            if (err)
                throw err;
            return handleRes(res, 200, 'Post deleted', false);
        });
        
    });
    
    
    /* HANDLING COMMENTS REQUESTS */
    
    app.post('/api/entry/post/', function(req, res) {
        
        /* Adding a new comment */
        
        if (!req.user) {
            return handleRes(res, 403, 'Unauthorized', true);
        }
        
        
        Entry.update({_id:req.body._id}, {$push:{comments:{commentId:genHexNum(), author:req.body.author, content:req.body.content, datePosted:Date.now()}}}, function(err, data) {
            if (err) 
                throw err;
            
            Entry.findOne({_id:req.body._id}, function(err, data) {
                if (err)
                    throw err;
                
                return res.status(200).send(data);
            });
            
        });
        
    });
    
    app.delete('/api/entry/post/', function(req, res) {
        
        /* Comment delete. Only for Admins */
        
        if (req.user.userLevel !== 2)
            return handleRes(res, 403, 'Unauthorized', true);
            
            
        Entry.update({_id:req.query.postId}, {$pull:{
            comments:{
                commentId:req.query.commentId
            }
        }}, function(err, data) {
            if (err)
                throw err;
                
            return handleRes(res, 201, 'comment deleted', false);
            
        });
        
    });
    
    /* HANDLING VOTE REQUESTS */
    
    app.post('/api/entry/vote/', function(req, res) {
        
        if (!req.user)
            return handleRes(res, 403, 'Unauthorized', true);
            
            
        switch(req.body.vote) {
            case 'up':
                req.body.vote = 1;
                break;
            case 'down':
                req.body.vote = -1;
                break;
            default:
                return handleRes(res, 202, 'Vote missmatch the specified parameters', true);
        }
            
        Entry.findOne({_id:req.body._id}, function(err, data) {
            if (err)
                throw err;
                
            for (var i=0;i<data.votes.voters.length;i++) {
                if (data.votes.voters[i].by === req.user.username)
                    return handleRes(res, 403, 'You already voted', true);
            }
            
            Entry.update({_id:req.body._id}, {$push:{
                'votes.voters':{
                    by:req.user.username,
                    vote:req.body.vote
                }
            },
            
            $inc:{
                'votes.totalVotes':req.body.vote
            }
            
            }, function(err, data) {
                if (err) 
                    throw err;
                
                handleRes(res, 201, 'vote registered', false);
                    
            });
                
        });  
        
    });
    
};