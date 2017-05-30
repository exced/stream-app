import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

export interface Confirm {
    confirmed: boolean;
    peerid: string;
}

@Injectable()
export class ConfirmService {

    private confirm: BehaviorSubject<Confirm>;

    constructor() {
        this.confirm = new BehaviorSubject({ confirmed: false, peerid: '' });
    }

    public activate: (message?: string, title?: string) => Promise<boolean>;

    getConfirm() {
        return this.confirm.asObservable();
    }

    setConfirm(confirm: Confirm) {
        this.confirm.next(confirm);
    }
}
