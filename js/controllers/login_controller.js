SocialChef.LoginController = Ember.ObjectController.extend({
    // ==========================================================================
    // PROPERTIES
    // ==========================================================================
    username: '',
    password: '',
    loginFailed: false,
    isProcessing: false,
    isSlowConnection: false,
    timeout: null,
    // ==========================================================================
    // END PROPERTIES
    // ==========================================================================
    actions : {
        login: function() {
            this.setProperties({
                loginFailed: false,
                isProcessing: true
            });

            var self = this;
            Ember.run.later(self, function(){
                self.slowConnection();
            }, 5000);

            var promise = Ember.$.ajax({
                            type: 'POST',
                            url: "/chefs/login",
                            contentType: "application/json",
                            dataType: "json",
                            data:  JSON.stringify(self.serialize())
                        });

            promise.success(function(response){
                Ember.run(function(){
                    self.success(response['username']);
                });
            });
            promise.fail(function(){
                Ember.run(function(){
                    self.failure();
                });
             });
        }
    },

    success: function(username) {
        this.reset();
        var controller = SocialChef.__container__.lookup("controller:application");
        controller.send('loggedIn', username);
        this.transitionToRoute('user', username);
    },

    failure: function() {
        this.reset();
        this.set("loginFailed", true);
    },

    slowConnection: function() {
        if (!this.get('loginFailed')) {
            this.set("isSlowConnection", true);
        }
    },

    reset: function() {
        clearTimeout(this.get("timeout"));
        this.setProperties({
            isProcessing: false,
            isSlowConnection: false
        });
    },

    serialize: function() {
        return {
            username: this.get('username'),
            password: this.get('password')
        };
    }
});
