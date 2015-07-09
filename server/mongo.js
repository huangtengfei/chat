var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/chat");

var UserSchema = mongoose.Schema({
    username: String,
    password: String
});

var MessageSchema = mongoose.Schema({
    username: String,
    message: String
});

var User = mongoose.model("user", UserSchema);
var Message = mongoose.model("message", MessageSchema);

exports.login = function(data, callback){
    User.findOne({'username': data.username}, function (err, doc) {

        if(err || !doc) {
            var user = new User({
                username: data.username,
                password: data.password
            });
            user.save(function (err, doc) {
                if(doc) {
                    callback({
                        errCode: 0,
                        result: true
                    })
                }
            });
        }else{
            if(data.password == doc.password){
                callback({
                    errCode: 0,
                    result: true
                })
            }else{
                callback({
                    errCode: 1
                })
            }
        }
    });
};

exports.listUser = function(socket){
    User.find({}, function (err, docs) {
        if(err || !docs) {
            socket.emit('list user', {
                errCode: 1
            })
        }else{
            socket.emit('list user', {
                errCode: 0,
                result: docs
            });
        }
    });
};

exports.createMessage = function(data, socket){
    var message = new Message(data);
    message.save(function (err, doc) {
        if(err || !doc) {
            socket.emit('createMessage', {
                errCode: 1
            })
        }else{
            socket.emit('createMessage', {
                errCode: 0,
                result: doc
            });
            socket.broadcast.emit('new message', data);
        }
    });
};

exports.listMessage = function(socket){
    Message.find({}, function (err, docs) {
        if(err || !docs) {
            socket.emit('list message', {
                errCode: 1
            })
        }else{
            socket.emit('list message', {
                errCode: 0,
                result: docs
            });
        }
    });
};

