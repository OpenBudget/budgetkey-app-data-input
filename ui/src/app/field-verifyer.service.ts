import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldVerifyerService {

  public verificationRequested = new Subject<void>();

  _validity: any = {};
  idx = 0;

  constructor() { }

  register() {
    this.idx++
    return 'v' + this.idx;
  }

  deregister(reg) {
    delete this._validity[reg];
  }

  verify() {
    this.verificationRequested.next();
  }

  update(id, validity) {
    this._validity[id] = validity;
  }

  valid() {
    for (const k of Object.keys(this._validity)) {
      if (!this._validity[k]) {
        return false;
      }
    }
    return true;
  }
}
