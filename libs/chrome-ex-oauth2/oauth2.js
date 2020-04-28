(function() {
    window.oauth2 = {

        access_token_url: "https://login.salesforce.com/services/oauth2/token",
        authorization_url: "https://login.salesforce.com/services/oauth2/authorize",
        client_id: "3MVG9CVKiXR7Ri5p.xBPSXaKLLbJkH_h9kS9VL5U3l6dPiVRebRH.OTm9zRtM4cS6SA90pEszYJ934mBv_4HN",
        client_secret: "2BCF90CAEAD0763523280F1518E6CA7EDBE31DB6583797D3CAAEE01B702EE466",
        redirect_url: "https://openidconnect.herokuapp.com/callback",
        scopes: ['full'],
        key: "oauth2_token",
        response_type: "code",

        /**
         * Starts the authorization process.
         */
        start: function() {
               console.log(this.access_token_url)
            window.close();
            var url = this.authorization_url + "?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_url + "&response_type=" + this.response_type;
//            for(var i in this.scopes) {
//                url += this.scopes[i];
//            }
            chrome.tabs.create({url: url, active: true});

        },

        /**
         * Finishes the oauth2 process by exchanging the given authorization code for an
         * authorization token. The authroiztion token is saved to the browsers local storage.
         * If the redirect page does not return an authorization code or an error occures when 
         * exchanging the authorization code for an authorization token then the oauth2 process dies
         * and the authorization tab is closed.
         * 
         * @param url The url of the redirect page specified in the authorization request.
         */
        finish: function(url) {

            function removeTab() {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id);
                });
            };
            console.log(url)
            if(url.match(/\?error=(.+)/)) {
                console.log(url)

                 removeTab();
            } else {
                var code = url.match(/(?<=\?code=).+/)[0];
                console.log(code)
                var that = this;
                var data = new FormData();

                data.append('grant_type','authorization_code')
                data.append('client_id', this.client_id);
                data.append('client_secret', this.client_secret);
                data.append('redirect_uri',this.redirect_url)
                data.append('code', code);

                console.log(data.keys())
                // Send request for authorization token.
                var xhr = new XMLHttpRequest();
                console.log(xhr.readyState)
                xhr.addEventListener('readystatechange', function(event) {
                    if(xhr.readyState == 4) {
                        console.log(xhr.responseText)
                        if(xhr.status == 200) {
                            console.log('hit status 200')
                            if(xhr.responseText.match(/error=/)) {
                                removeTab();
                            } else {
                                // Parsing JSON Response.
                                var response = xhr.responseText;
                                var jsonResponse = JSON.parse(response);
                                // Replace "access_token" with the parameter
                                // relevant to the API you're using.
                                var tokenOauth = jsonResponse.access_token
                                console.log(tokenOauth)
                                var obj = { 'token': tokenOauth,
                                            'instance_url' : jsonResponse.instance_url};
                                this.key = obj
                                console.log(jsonResponse)
                                // Storing in Chrome Local Storage.
                                chrome.storage.sync.set(obj, function() {
                                    // Notify that we saved.
                                    console.log('tokensaved')
                                    console.log('oAuth Token saved');

                                });
                                removeTab();
                            }
                        } else {
                            removeTab();

                        }
                    }
                });

                var body = 'grant_type=authorization_code&redirect_uri='+this.redirect_url+'&client_id='+this.client_id+'&client_secret='+this.client_secret+'&code='+code
                xhr.open('POST', this.access_token_url, true);

                xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')

                xhr.send(body);

            }
        },
        
        /**
         * Retreives the authorization token from Chrome Storage.
         */
        getToken: function(callback) {
            chrome.storage.sync.get("token",callback);

//            chrome.storage.sync.get("token", function(result) {
//                console.log(result.token)
//            });

        },

        /**
         * Clears the authorization token from the Chrome storage.
         */
        clearToken: function() {
            chrome.storage.local.remove("token", function() {
                console.log("Token Cleared");
            });
        }
    }
})();
