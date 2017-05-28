import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

export interface Confirm {
    confirmed: boolean;
    socketid: string;
}

@Injectable()
export class ConfirmService {

    confirm: BehaviorSubject<Confirm>;

    constructor() {
        this.confirm = new BehaviorSubject({ confirmed: false, socketid: '' });
    }

    public activate: (message?: string, title?: string) => Promise<boolean>;

    getConfirm() {
        return this.confirm.asObservable();
    }

    setConfirm(confirm: Confirm) {
        this.confirm.next(confirm);
    }
}
