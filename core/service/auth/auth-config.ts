import { URLSearchParams } from "url"
import Config from "../config";

export default class AuthConfig {
    private redirectUri: string;

    static fromConfig(config: Config): AuthConfig{
        return new AuthConfig(config.baseUrl, config.tenantId, config.clientId, config.clientSecret)
    }

    constructor(private baseUrl:URL,private  tenantId:string,private  clientId:string,private  clientSecret:string) {
       
        this.redirectUri = new URL("/azuread", this.baseUrl).toString();
    }

    isDisabled(): boolean {
        if(this.baseUrl.hostname === "localhost") {
            if(!this.clientId){
                return true;
            }
        }
        return false;
    }

    createAuthorizationUrl(token:string): URL {
        const url = new URL("https://login.microsoftonline.com/");
        url.pathname = `/${this.tenantId}/oauth2/v2.0/authorize`;
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("redirect_uri", this.redirectUri);
        url.searchParams.set("scope", "openid");
        url.searchParams.set("state", token);
        url.searchParams.set("response_mode", "form_post");
        return url;
    }

    authorityUrl(): string {
        return "https://login.microsoftonline.com/" + this.tenantId + "/oauth2/v2.0/token";
    }

    accessTokenParam(code:string):URLSearchParams  {
        const params = new URLSearchParams();
        params.set("client_id", this.clientId);
        params.set("grant_type", "authorization_code");
        params.set("code", code);
        params.set("redirect_uri", this.redirectUri);
        params.set("client_secret", this.clientSecret);
        return params;
    }
}