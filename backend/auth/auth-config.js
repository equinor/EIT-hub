const { URLSearchParams } = require('url');

class AuthConfig {
    static fromConfig(config){
        return new AuthConfig(config.baseUrl, config.tenantId, config.clientId, config.clientSecret)
    }

    constructor(baseUrl, tenantId, clientId, clientSecret) {
        this.baseUrl = baseUrl;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = new URL("/azuread", this.baseUrl).toString();
    }

    createAuthorizationUrl(token) {
        let url = new URL("https://login.microsoftonline.com/");
        url.pathname = `/${this.tenantId}/oauth2/v2.0/authorize`;
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("redirect_uri", this.redirectUri);
        url.searchParams.set("scope", "openid");
        url.searchParams.set("state", token);
        url.searchParams.set("response_mode", "form_post");
        return url;
    }

    authorityUrl() {
        return "https://login.microsoftonline.com/" + this.tenantId + "/oauth2/v2.0/token";
    }

    accessTokenParam(code) {
        let params = new URLSearchParams();
        params.set("client_id", this.clientId);
        params.set("grant_type", "authorization_code");
        params.set("code", code);
        params.set("redirect_uri", this.redirectUri);
        params.set("client_secret", this.clientSecret);
        return params;
    }
}

module.exports = AuthConfig;