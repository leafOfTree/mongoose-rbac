var rbac = {};

rbac.init = function (config) {
    rbac.config = config;
    rbac.attach(config.schema);
};

// attach to mongoose's UserSchema
rbac.attach = function (UserSchema) {
    var config = this.config;

    UserSchema.add({
        roles: [ String ],
    });

    UserSchema.methods.can = function (operate, resource) {
        var roles = this.roles,
            allows,
            _can = false;

        // check  grants
        roles.forEach(function (role) {
            allows = config.grants[role][resource];

            if (allows && allows.indexOf(operate) > -1) {
                _can = true;
            }
        });

        // check customs callback func
        if (!_can) {
            _can = config.callback(this, operate, resource);
        }

        return _can;
    };
};

module.exports = rbac;
