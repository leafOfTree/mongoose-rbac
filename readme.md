# simple-mongoose-rbac
Role based access control for mongoose, a simple user authority manager solution.

## require
> "mongoose": "~3.8.8"

## install
```bash
npm install simple-mongoose-rbac --save-dev
```

## Usage & Test
```js
'use strict';

var mongoose = require('mongoose'),
    rbac = require('./index.js');

var UserSchema = new mongoose.Schema({ name: String });

// usage of rbac: just init with config
rbac.init({
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
    },
    schema: UserSchema, 
});
// end

var User = mongoose.model('User', UserSchema);

var John = new User({ name: 'John', roles: ['user'] }),
    Oliver = new User({ name: 'Oliver', roles: ['admin'] }),
    Lee = new User({ name: 'Lee', roles: ['admin', 'user'] });

var expects = [
    John.can('add', 'comment')  === true,
    John.can('delete', 'comment')  === false,
    Oliver.can('add', 'comment')  === false,
    Oliver.can('delete', 'comment')  === true,
    Lee.can('add', 'comment')  === true,
    Lee.can('delete', 'comment')  === true,
    John.can('do', 'sths')  === true,
], passed = true;

expects.forEach(function (res, i) {
    if (!res) {
        console.log('The ' + i + ' th test result failed.');
        passed = false;
    }
});

if (passed) {
    console.log('Test passed.');
}
```
