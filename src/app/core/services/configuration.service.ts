import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor() { }
  get apiUrl(): string {
    return environment.production ? 'https://ownapi.meancloud.in' : 'http://localhost:5001';
  }

  get mediaBaseUrl(): string {
    return environment.production ? 'https://secure-data-upload-new.s3.ap-south-1.amazonaws.com/' : 'https://secure-data-upload-new.s3.ap-south-1.amazonaws.com/';
  }
}
