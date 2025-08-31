import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { Excercise } from "./excercise.model";

import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Injectable } from "@angular/core";
import { UIService } from "../ui.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

// import { Firestore, collection, addDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';


@Injectable()
export class TrainingService {

    excerciseChanged = new Subject<any>();
    availableExEvent = new Subject<any>();
    finishedExEvent = new Subject<Excercise[]>();
    newRcom = new ReplaySubject<string>(1);

    fbSubscriptions: Subscription[] = [];

    private availableExcercises: Excercise[] = [
        // { id: 'crunches', name: 'Crunches', duration: 10, calories: 8 },
        // { id: 'touch-toe', name: 'Touch Toe', duration: 180, calories: 18 },
        // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 11 },
        // { id: 'burpees', name: 'Burpees', duration: 60, calories: 6 },
    ];

    private runningExcercise?: Excercise;
    // finishedExcecises: Excercise[] = [];

    private baseUrl = environment.trackFIT_URL;

    constructor(private firestore: Firestore,
                private httpClient: HttpClient,
                private uiService: UIService){}

    getAvaialbleExcercises(){
        
        this.uiService.loadingStateEvent.next(true);

        this.fbSubscriptions.push(this.fetchAvailableExcercisesFromFirebase().subscribe((data) => {
            this.availableExcercises = data;
            console.log('data from mongodb database',data);
            this.availableExEvent.next(this.availableExcercises);
            this.uiService.loadingStateEvent.next(false);
        },
        error => {
            this.uiService.showSnackbar('Failed to fetch the excercises, Please try again' + error.message, '', 3000);
            this.uiService.loadingStateEvent.next(false);
            this.availableExEvent.next(null);
        }));

        // return this.availableExcercises.slice();
    }

    fetchAvailableExcercisesFromFirebase(): Observable<any[]> {
        return this.httpClient.get<Excercise[]>(this.baseUrl + '/excercises');
    }

    startExcercise(selectedId: string){
        const selectedExcercise = this.availableExcercises.find(ex => ex.id === selectedId);
        this.runningExcercise = selectedExcercise;
        this.excerciseChanged.next({ ...this.runningExcercise });
    }

    getRunningExcercise(){
        return { ...this.runningExcercise };
    }

    completeExcercise(){
        if(this.runningExcercise){
            this.addDataToDatabase(
                { ...this.runningExcercise, 
                    date: new Date(), 
                    state: 'completed'
                });
        }
        this.runningExcercise = undefined;
        this.excerciseChanged.next(null);
    }

    cancelExcercise(progress: number){
        if(this.runningExcercise){
            this.addDataToDatabase(
                { ...this.runningExcercise, 
                    duration: this.runningExcercise.duration * (progress / 100),
                    calories: this.runningExcercise.calories * (progress / 100),
                    date: new Date(), 
                    state: 'cancelled'
                });

        }
        this.runningExcercise = undefined;
        this.excerciseChanged.next(null);
    }

    fetchAllPastExcercises(){
        // return this.excecises;

        this.httpClient.get<Excercise[]>(this.baseUrl + '/excercises/complete/user123').subscribe({
            next: (res) => {
                console.log('finished from db => ', res);
                this.finishedExEvent.next(res);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    addDataToDatabase(excercise: Excercise){
        
        this.httpClient.post(this.baseUrl + '/excercises/complete', {...excercise, userId: 'user123'}).subscribe({
            next: (response) => {
                console.log('Exercise saved successfully:', response);
                // this.newRcom.next('new');
            },
            error: (err) => {
                console.error('Error saving exercise:', err);
            },
            complete: () => {
                console.log('Request completed');
            }
        });

    } 

    cancelSubscriptions(){
        this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }

}