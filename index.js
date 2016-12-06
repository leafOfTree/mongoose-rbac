'use strict';

var rbac = {};

rbac.init = function (config) {
    rbac.config = config;
};

rbac.attach = function (UserSchema) {
    var config = this.config;

    UserSchema.add({
        roles: [ String ],
    });

    UserSchema.methods.can = function (ope, res) {
        var roles = this.roles,
            allows,
            canDo = false;

        // check  grants
        roles.forEach(function (role) {
            var allows = config.grants[role][res];
            if (allows && allows.indexOf(ope) > -1) {
                canDo = true;
            }
        });

        // check customs callback func
        if (!canDo) {
            canDo = config.callbacks(this, ope, res)
        }

        return canDo;
    };
};

module.exports = rbac;
