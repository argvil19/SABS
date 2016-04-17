    app.factory('postSvc', function($resource, $location, UserService) {
        var posts = $resource('/api/entry/');
        var singlePost = $resource('/api/entry/:id', {id:'@id'}, {edit:{method:'PUT'}});
        var comment = $resource('/api/entry/post/');
        var voteRes = $resource('/api/entry/vote/');
        
        function checkByTag(tags, that) {
            for (var i=0;i<tags.length;i++) {
                for (var x=0;x<that.posts.length;x++) {
                    for (var y=0;y<that.posts[x].tags.length;y++) {
                        if (tags[i].tagName === that.posts[x].tags[y])
                            tags[i].posts.push(that.posts[x]);
                    };
                };
            };
            that.tags = tags;
        };
        
        return {
            getPosts:function() {
                var that = this;
                this.posts = posts.query({}, function(data) {
                    that.tagsPerPost();
                });
            },
            newPost:function(post) {
                post.author = UserService.authInfo.username;
                post.tags = post.tags.split(' ');
                return posts.save(post, function(data) {
                    $location.url('/admin/dashboard/');
                });
            },
            getInfoEditPost:function(post){
                var that = this;
                singlePost.get({id:post._id}, function(data) {
                    that.infoEditPost = data;
                    $location.url('/admin/dashboard/edit-post/');
                });
            },
            editPost:function(){
                var that = this;
                singlePost.edit({id:this.infoEditPost._id}, this.infoEditPost, function() {
                    $location.url('/admin/dashboard/');
                    that.getPosts();
                });
            },
            deletePost:function(post) {
                var that = this;
                singlePost.delete({id:post._id}, function(data) {
                    that.infoEditPost = {};
                    that.getPosts();
                });
            },
            addComment:function(post) {
                var that = this;
                comment.save({_id:post._id, author:UserService.authInfo.username, content:this.newComment.content}, function(data) {
                    that.newComment = {};
                    that.activePost = data;
                    that.getPosts();
                });
            },
            formatText:function(content) {
                return content
            },
            votePost:function(post, vote) {
                var that = this;
                post.vote = vote;
                voteRes.save(post, function(data) {
                    if (data.error)
                        return;
                            
                    that.getPosts();
                });
            },
            deleteComment:function(post, commentSel) {
                var that = this;
                comment.remove({postId:post._id, commentId:commentSel.commentId}, function(data) {
                    singlePost.get({id:$location.path().substr(6)}, function(data) {
                        that.activePost = data;
                    });
                });
            },
            tagsPerPost:function() {
                var tags = [];
                for (var i=0;i<this.posts.length;i++) {
                    for (var x=0;x<this.posts[i].tags.length;x++) {
                        if (tags.indexOf(this.posts[i].tags[x]) === -1)
                            tags.push({tagName:this.posts[i].tags[x], posts:[]});
                    };
                };

                checkByTag(tags, this);
            },
            newComment:{},
            singlePost:singlePost,
            posts:{},
            infoEditPost:{},
            activePost:{},
            tags:[]
        };
        
    });
