/*
import {Injectable} from '@angular/core';
import {Value} from '../value/value';
import {LocalStorageService} from '../localStorage.service/local-storage.service';
import {MessagesService} from '../messages.service/messages.service';
import {Message} from '../message/message';

@Injectable({
  // we declare that this service should be create
  // by a root application injector
  providedIn: 'root'
})
export class DictionaryService {
  private nextId: number;
  private domain: string;
  private range: string;
  private index: number;
  private dictionary: Value[];

  private duplicateArray: number[];

  /!**
   *  it fetches dictionary from local storage. If the dictionary
   *  is empty set the id to 0, while if the
   *  dictionary has a element set the key id to the next
   *  number
   * @param {LocalStorageService} storageService
   * @param {MessagesService} messageService
   *!/
  constructor(private storageService: LocalStorageService,
              private messageService: MessagesService) {
    const dictionary = this.getDictionary();
    if (dictionary.length === 0) {
      this.nextId = 0;
    } else {
      const maxId = dictionary[dictionary.length - 1].id;
      this.nextId = maxId + 1;
    }

  }

  /!**
   * retrive dictionary from localStorage service
   * @returns {Value[]} dictionary
   *!/
  public getDictionary(): Value[] {
    return this.storageService.getDictionary();
  }

  /!**
   * control if the value has a validation problem
   * @param {Value} value insert by the user
   * @returns {boolean} return if value has validation problem or not
   *!/
  public controlValue(value: Value): boolean {

    this.dictionary = this.getDictionary();
    this.range = value.range.toLocaleLowerCase();
    this.domain = value.domain.toLocaleLowerCase();
    this.index = this.dictionary.findIndex(valueInd => valueInd.id === value.id); // retrive the current position in the dictionary
    if (this.index !== -1) {
      this.dictionary.splice(this.index, 1);
    }
    return this.thereIsNotInconsistency(); // validation rules
  }


  /!**
   *
   * @param {Value} value
   * @returns {boolean}
   *!/
  public addValue(value: Value) {
    value.id = this.nextId;
    value.duplicate = this.duplicateArray;
    const dictionary = this.getDictionary();

    dictionary.push(value);
    this.updateStorage(dictionary);
    this.nextId++;

  }

  /!**
   *
   * @param {Value} value
   *!/
  public setValue(value: Value) {

    value.duplicate = this.duplicateArray;
    const dictionary = this.getDictionary();
    const index = dictionary.findIndex(valueInd => valueInd.id === value.id);

    dictionary[index] = value;

    this.updateStorage(dictionary);
  }

  /!**
   * thought filter() method creates a new dictionary with all elements except the element passed by user
   * @param {number} id identifier of element that it wants delete
   *!/
  public removeValue(id: number) {
    const dictionary = this.getDictionary().filter((value) => value.id !== id);
    this.updateStorage(dictionary);
  }


  /!**
   * update the whole dictionary
   * @param {Value[]} dictionary that pass to setLocalStorage
   *!/

  private updateStorage(dictionary: Value[]) {
    this.storageService.setLocalStorageDictionary(dictionary);
  }

  /!************************!/

  /!**
   *
   * @returns {boolean}
   *!/
  private thereIsNotInconsistency(): boolean {
    let isValidate = true;
    const messageWarning = new Message('', false);
    const messageError = new Message('', true);

    if (this.duplicate()) {
      isValidate = false;
      messageWarning.content = 'There is a duplicate, your entries, both domain and value, correspond to data already present';
      this.messageService.add(messageWarning);
    } else if (this.fork()) {
      isValidate = false;
      messageWarning.content = 'There is a fork, your entry domain correspond to other data domains already present';
      this.messageService.add(messageWarning);
    }

    if (this.cycles()) {
      isValidate = false;
      messageError.content = 'There is a cycle, your entry resulting in a never-ending transformation with other entries';
      this.messageService.add(messageError);
    } else if (this.chain()) {
      isValidate = false;
      messageError.content = 'There is a chain, your value range, or domain, entry appear in domain, or range, of other entries';
      this.messageService.add(messageError);
    }
    this.domain = '';
    this.range = '';
    this.index = -1;
    this.dictionary = [];

    return isValidate;
  }

  private duplicate(): boolean {
    this.duplicateArray = [];
    this.dictionary.filter(value => {
      if ((value.range.toLocaleLowerCase().indexOf(this.range) !== -1) && (value.domain.toLocaleLowerCase().indexOf(this.domain) !== -1)) {
        this.duplicateArray.push(value.id);
      }
    })
    if (this.duplicateArray.length !== 0) {
      return true;
    }
    return false;
  }

  private fork(): boolean {
    const fork = this.dictionary.findIndex(value => (
      value.domain.toLocaleLowerCase().indexOf(this.domain) !== -1) && (value.range.toLocaleLowerCase().indexOf(this.range) === -1));
    if (fork !== -1) {
      return true;
    }
    return false;

  }

  private cycles(): boolean {
    const cycles = this.dictionary.findIndex(value => (
      value.domain.toLocaleLowerCase().indexOf(this.range) !== -1) && (value.range.toLocaleLowerCase().indexOf(this.domain) !== -1));
    if (cycles !== -1) {
      return true;
    }
    return false;
  }


  private chain(): boolean {
    const chain = this.dictionary.findIndex(value => (
      value.range.toLocaleLowerCase().indexOf(this.domain) !== -1) || (value.domain.toLocaleLowerCase().indexOf(this.range) !== -1));
    if (chain !== -1) {
      return true;
    }
    return false;
  }
}
*/
