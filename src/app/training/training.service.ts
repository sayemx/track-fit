import { Observable, Subject, Subscription } from "rxjs";
import { Excercise } from "./excercise.model";

import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Injectable } from "@angular/core";
import { UIService } from "../ui.service";

// import { Firestore, collection, addDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';


@Injectable()
export class TrainingService {

    excerciseChanged = new Subject<any>();
    availableExEvent = new Subject<any>();
    finishedExEvent = new Subject<Excercise[]>();

    fbSubscriptions: Subscription[] = [];

    private availableExcercises: Excercise[] = [
        // { id: 'crunches', name: 'Crunches', duration: 10, calories: 8 },
        // { id: 'touch-toe', name: 'Touch Toe', duration: 180, calories: 18 },
        // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 11 },
        // { id: 'burpees', name: 'Burpees', duration: 60, calories: 6 },
    ];

    private runningExcercise?: Excercise;
    // finishedExcecises: Excercise[] = [];

    constructor(private firestore: Firestore,
                private uiService: UIService){}

    getAvaialbleExcercises(){
        
        this.uiService.loadingStateEvent.next(true);

        this.fbSubscriptions.push(this.fetchAvailableExcercisesFromFirebase().subscribe((data) => {
            this.availableExcercises = data;
            console.log('data from firebase database',data);
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
        const usersRef = collection(this.firestore, 'availableExcercises') as CollectionReference<DocumentData>;
        return collectionData(usersRef, { idField: 'id' }) as Observable<any[]>;
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
            // this.excecises.push(
            //     { ...this.runningExcercise, 
            //         date: new Date(), 
            //         state: 'completed'
            //     });

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
            // this.excecises.push(
            //     { ...this.runningExcercise, 
            //         duration: this.runningExcercise.duration * (progress / 100),
            //         calories: this.runningExcercise.calories * (progress / 100),
            //         date: new Date(), 
            //         state: 'cancelled'
            //     });

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

        const usersRef = collection(this.firestore, 'finishedExcercises') as CollectionReference<DocumentData>;
        
        
        this.fbSubscriptions.push(collectionData(usersRef, { idField: 'id' }).subscribe(
            (excercises: any[]) => {
                const transformed = excercises.map((ex: any) => ({
                    ...ex,
                    date: ex.date ? ex.date.toDate() : null // convert Firestore Timestamp to JS Date
                }));

            console.log('finished from db => ', transformed);
            this.finishedExEvent.next(transformed);
            }
        ));
    }

    addDataToDatabase(excercise: Excercise){
        
        const finishedCollection: CollectionReference<DocumentData> = collection(this.firestore, 'finishedExcercises');
        
        addDoc(finishedCollection, excercise)
            .then(() => {
                console.log('Finished exercise saved successfully!');
            })
            .catch((error) => {
                console.error('Error saving finished exercise:', error);
            });
    }

    cancelSubscriptions(){
        this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }

}