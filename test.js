'use strict';

var rbac = require('./index.js'),
    mongoose = require('mongoose');


var config = {
    //roles: ['user', 'admin'],
    //permissions: {
        //'comment': ['add', 'delete']
    // },
    grants: {
        'user': {
            'comment': ['add'],
        },
        'admin': {
            'comment': ['delete'],
        },
    },
    callback: function (user, ope, res) {
        if (user.name === 'John' && ope === 'do') {
            return true;
        } else {
            return false;
        }
    }
};

rbac.init(config);

var UserSchema = new mongoose.Schema({ name: String });

rbac.attach(UserSchema);

var User = mongoose.model('User', UserSchema);

var John = new User({ name: 'John', roles: ['user'] }),
    Oliver = new User({ name: 'Oliver', roles: ['admin'] }),
    Ohi = new User({ name: 'Oliver', roles: ['admin', 'user'] });

var expects = [
    John.can('add', 'comment')  === true,
    John.can('delete', 'comment')  === false,
    Oliver.can('add', 'comment')  === false,
    Oliver.can('delete', 'comment')  === true,
    Ohi.can('add', 'comment')  === true,
    Ohi.can('delete', 'comment')  === true,
    John.can('do', 'sths')  === true,
];

expects.forEach(function (res, i) {
    if (!res) {
        console.log('The ' + i + ' th test result failed.');
    }
});
