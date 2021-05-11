import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListStateService {

  state: any = {};

  constructor() { }

  set(x, value) {
    this.state[x] = value;
  }

  get(x) {
    return !!this.state[x];
  }

  clear() {
    this.state = {};
  }
}
