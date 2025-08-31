import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { inject } from '@angular/core';

import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { TrainingService } from "../training/training.service";
import { UIService } from "../ui.service";
import { OAuthService } from "angular-oauth2-oidc";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class AuthService {

    private auth: Auth = inject(Auth);
    claims: any;
    private httpClient = inject(HttpClient);
    private baseUrl = environment.trackFIT_URL;

    constructor(private oauth: OAuthService,
                private router: Router, 
                private trainingService: TrainingService,
                private uiService: UIService) {
        onAuthStateChanged(this.auth, (user) => {
            console.log('User status changed:', user);
        });

        this.oauth.configure(environment.authConfig);
        this.oauth.loadDiscoveryDocumentAndTryLogin().then(() => {
            console.log("Discovery doc loaded");
            if (this.oauth.hasValidAccessToken()) {
                console.log("Already logged in");
                this.router.navigate(['/training']);
            }
        });

        this.oauth.events.subscribe(e => {
            if (e.type === 'token_received') {
                this.authChange.next(true);
            }
            if (e.type === 'logout') {
               this.authChange.next(false);
            }
        });
    }

    // private user: User | undefined | null;

    authChange = new Subject<boolean>();

    isAuthenitcated = false;

    registerUser(authData: AuthData){
        // this.user = {
        //     email: authData.email,
        //     userId: Math.round(Math.random() * 10000).toString()
        // };
        this.uiService.loadingStateEvent.next(true);

        createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then(userCredential => {
                this.uiService.loadingStateEvent.next(false);
                console.log('User registered:', userCredential.user);

                this.authChange.next(true);
                this.router.navigate(['/training']);
            })
            .catch(error => {
                this.uiService.loadingStateEvent.next(false);
                this.uiService.showSnackbar('Registration Failed: ' + error.message, '', 3000);
                // console.error('Registration failed:', error.message);
            });
        
    }

    login(authData: AuthData){
        // this.user = {
        //     email: authData.email,
        //     userId: Math.round(Math.random() * 10000).toString()
        // };

        this.uiService.loadingStateEvent.next(true);

        signInWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then(userCredential => {
                this.uiService.loadingStateEvent.next(false);
                this.isAuthenitcated = true;
                console.log('Login Successful:', userCredential.user);

                this.authChange.next(true);
                this.router.navigate(['/training']);

            })
            .catch(error => {
                this.uiService.loadingStateEvent.next(false);
                this.uiService.showSnackbar('Login Failed: ' + error.message, '', 3000);
                // console.error('Login failed:', error.message);
            });

        
    }

    logout(){
        // this.user = null;

        this.trainingService.cancelSubscriptions();
        
        this.auth.signOut();
        this.isAuthenitcated = false;

        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    isAuth(){
        // return this.user != null;
        return this.isAuthenitcated;
    }


    login1() {
        this.oauth.initCodeFlow(); // starts PKCE flow
    }

    logout1() {
        this.oauth.logOut();
    }

    isLoggedIn() {
        return this.oauth.hasValidAccessToken();
    }

    registerUser1(authData: AuthData){

        this.uiService.loadingStateEvent.next(true);

            this.httpClient.post(this.baseUrl + '/users/register', authData).subscribe({
                next: (res) => {
                    this.uiService.loadingStateEvent.next(false);
                    this.uiService.showSnackbar('User Regustered:', authData.email, 3000);
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.log(err);
                    this.uiService.loadingStateEvent.next(false);
                this.uiService.showSnackbar('Registration Failed: ' + err.message, '', 3000);   
                }
            });
        
    }

    registerUserKeyCloak(authData: AuthData){

        this.uiService.loadingStateEvent.next(true);

            this.httpClient.post(this.baseUrl + '/users/register/keyCloak', authData).subscribe({
                next: (res) => {
                    this.uiService.loadingStateEvent.next(false);
                    this.uiService.showSnackbar('User Regustered:', authData.email, 3000);
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.log(err);
                    this.uiService.loadingStateEvent.next(false);
                this.uiService.showSnackbar('Registration Failed: ' + err.message, '', 3000);   
                }
            });
        
    }
    
}