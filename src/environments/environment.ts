import { AuthConfig } from "angular-oauth2-oidc";

export const environment = {
    production: false,

    trackFIT_URL: 'http://localhost:9000/api',

    firebase: {
        apiKey: "AIzaSyBZjUq1QPBQb0BATJ_qYZ_3ITKCJEUA6FA",
        authDomain: "ng-fitness-tracker-226a7.firebaseapp.com",
        projectId: "ng-fitness-tracker-226a7",
        storageBucket: "ng-fitness-tracker-226a7.firebasestorage.app",
        messagingSenderId: "413143531920",
        appId: "1:413143531920:web:8ce366efe999656bca7315",
        measurementId: "G-1XF812RHQ8"
    },

    authConfig:    {
        issuer: 'http://localhost:8181/realms/trackfit-oauth2',
        redirectUri: 'http://localhost:4200',
        clientId: 'trackfit-pkce-client',
        responseType: 'code',                           // Authorization Code + PKCE
        scope: 'openid profile email',                  // add custom scopes if any
        showDebugInformation: true,                     // dev only
        useSilentRefresh: true,                         // keeps session alive
        // silentRefreshRedirectUri: `${window.location.origin}/silent-refresh.html`,
        strictDiscoveryDocumentValidation: false        // useful during dev/self-signed
    }



}