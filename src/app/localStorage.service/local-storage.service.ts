import { Injectable } from '@angular/core';
import {Value} from '../value/value';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  /**
   * getItem method is to fetch dictionary from the local storage if the
   * storage is available
   * otherwise an empty array
   */
  getDictionary(): Value[] {
    // The JSON.parse() method parses a JSON string,constructing
    // the JavaScript value or object described by the string.
    if (this.storageAvailable('localStorage')) { // check if storage is available
      const localStorageItem = JSON.parse(localStorage.getItem('dictionary'));
      return localStorageItem == null ? [] : localStorageItem.dictionary;
    }
  }


  /**
   * setLocalStorageDictionary requires a array of value and then pass, with
   * setItem method, to the localStorage with 'dictionary' key and the array
   * as a value, the method will add that key to the storage,
   * or update that key's value if it already exists.
   */

  public setLocalStorageDictionary(dictionary: Value[]) {
    if (this.storageAvailable('localStorage')) { // check if storage is available
      localStorage.setItem('dictionary', JSON.stringify({dictionary}));
    }
  }

  /**
   * Here is a function that detects whether localStorage is both supported and available
   * @param type is a property on the window object named localStorage.
   */
  private storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && (
          // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        (storage && storage.length !== 0);
    }
  }
}
