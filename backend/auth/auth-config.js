class AuthConfig {
    static fromConfig(config){
        return new AuthConfig(config.basePath, config.tenant, config.clientId)
    }

    constructor(basePath, tenant, clientId) {
        this.basePath = basePath;
        this.tenant = tenant;
        this.clientId = clientId;
    }

    createAuthorizationUrl(token, redirectPath) {
        let url = new URL("https://login.microsoftonline.com/");
        url.pathname = `/${this.tenant}/oauth2/v2.0/authorize`;
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("redirect_uri", new URL(redirectPath, this.basePath).toString());
        url.searchParams.set("scope", "openid");
        url.searchParams.set("state", token);
        url.searchParams.set("response_mode", "form_post");
        return url;
    }
}