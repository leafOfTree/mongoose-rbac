'use strict';

var rbac = require('./index.js'),
    mongoose = require('mongoose');


var config = {
    roles: ['user', 'admin'],
    permissions: {
        'comment': ['add', 'delete']
    },
    grants: {
        'user': {
            'comment': ['add'],
        },
        'admin': {
            'comment': ['delete'],
        },
    },
    callbacks: function (user, ope, res) {
        if (user.name === 'John' && ope === 'does') {
            return true
        } else {
            return false
        }
    }
}

rbac.init(config)

var UserSchema = new mongoose.Schema({ name: String })

rbac.attach(UserSchema)

var User = mongoose.model('User', UserSchema)

var John = new User({ name: 'John', roles: ['user'] }),
    Oliver = new User({ name: 'Oliver', roles: ['admin'] }),
    O = new User({ name: 'Oliver', roles: ['admin', 'user'] })

var a, b, c, d
a = John.can('add', 'comment')
b = John.can('delete', 'comment')
c = Oliver.can('add', 'comment')
d = Oliver.can('delete', 'comment')
//console.log(a === true)
//console.log(b === false)
//console.log(c === false)
//console.log(d === true)
//console.log(O.can('add', 'comment') === true)
//console.log(O.can('delete', 'comment') === true)
console.log(John.can('do', 'sth'))
