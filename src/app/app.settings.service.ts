import { Injectable } from '@angular/core';

@Injectable()
export class AppSettingsService {

    URL: string = 'http://localhost:3000';

    constructor() {
    }
}