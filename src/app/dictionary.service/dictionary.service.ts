import {Injectable, OnInit} from '@angular/core';
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
  private dictionary: Value[];
  private value: Value;


  /**
   *  it fetches dictionary from local storage. If the dictionary
   *  is empty set the id to 0, while if the
   *  dictionary has a element set the key id to the next
   *  number
   * @param {LocalStorageService} storageService
   * @param {MessagesService} messageService
   */
  constructor(private storageService: LocalStorageService,
              private messageService: MessagesService) {
    this.dictionary = this.getDictionary();
    if (this.dictionary.length === 0) {
      this.nextId = 0;
    } else {
      const maxId = this.dictionary[this.dictionary.length - 1].id;
      this.nextId = maxId + 1;
    }

  }

  /**
   * retrive dictionary from localStorage service
   * @returns {Value[]} dictionary
   */
  public getDictionary(): Value[] {
    return this.storageService.getDictionary();
  }

  /**
   * sets value.id with the nextId, sets this.value with the value choose, looks for validation problem,
   * pushes value in dictionary, updates the storage with this value, and finally adds +1 to the nextId
   * @param {Value} value that user wants to change
   */
  public addValue(value: Value) {
    value.id = this.nextId;
    this.dictionary = this.getDictionary();
    this.value = value;

    this.duplicate(); // looking for a duplicate
    this.fork(); // looking for a fork
    this.cycles(); // looking for a cycle
    this.chain(); // looking for a chain

    this.dictionary.push(value);
    this.updateStorage(this.dictionary);
    this.nextId++;

  }

  /**
   * looks for a index of the value that user wants to change, sets this.value with the value choose, looks for validation problem,
   * changes value in dictionary, and finally update the storage with this value
   * @param {Value} value that user wants to change
   */
  public setValue(value: Value) {

    this.dictionary = this.getDictionary();
    const index = this.dictionary.findIndex(valueInd => valueInd.id === value.id);
    this.value = value;
    // this.dictionary.splice(index, 1);

    this.duplicate(); // looking for a duplicate
    this.fork(); // looking for a fork
    this.cycles(); // looking for a cycle
    this.chain(); // looking for a chain

    this.dictionary[index] = this.value;
    this.updateStorage(this.dictionary);

  }

  /**
   * through filter() method creates a new dictionary with all elements except the element passed by user
   * @param {number} id identifier of element that it wants delete
   */
  public removeValue(valueRem: Value) {
    this.dictionary = this.getDictionary();
    this.value = valueRem;
    this.removeDuplicateRef();
    this.removeForkRef();
    this.removeCycleRef();
    this.removeChainRef();
    this.dictionary = this.dictionary.filter((value) => value.id !== valueRem.id);
    this.updateStorage(this.dictionary);
  }


  /**
   * update the whole dictionary
   * @param {Value[]} dictionary that pass to setLocalStorage
   */

  private updateStorage(dictionary: Value[]) {
    this.storageService.setLocalStorageDictionary(dictionary);
  }

  /**
   * set duplicate array empty, through findIndex it selects only the selected value(domain, range) that match with other value(value,
   * range). So, if there are duplicates add the id of selected value to the matched duplicate value and the id of the matched duplicate
   * to the selected value, finally if there are one o more matches add a new message
   */
  private duplicate() {
    this.value.duplicate = [];
    this.removeDuplicateRef();
    const findIndex = this.dictionary.findIndex(value => {
      if ((value.range.toLocaleLowerCase().indexOf(this.value.range.toLocaleLowerCase()) !== -1) &&
        (value.domain.toLocaleLowerCase().indexOf(this.value.domain.toLocaleLowerCase()) !== -1) &&
        value.id !== this.value.id) {
        this.value.duplicate.push(value.id);
        value.duplicate.push(this.value.id);
      }
    });
    if (findIndex !== -1) {
      this.messageService.add(new Message(
        'There is a duplicate, your entries, both domain and value, correspond to data already present. Click on the ' +
        'the icon to see more details', false));
    }
  }

  /**
   * sets fork array empty, creates an array (Value[]) of duplicate value, creates creates an array (Value[]) of fork value (i.e.
   * when only domain of a value match with another value), remove duplicate array from fork array, if there are fork add the id of
   * selected value to the matched fork value and the id of the matched fork to the selected value
   * and finally if there are one o more matches add a new message
   */
  private fork() {
    this.value.fork = [];
    this.removeForkRef();
    const duplicate = this.dictionary.filter(value =>
      (value.range.toLocaleLowerCase().indexOf(this.value.range.toLocaleLowerCase()) !== -1) &&
      (value.domain.toLocaleLowerCase().indexOf(this.value.domain.toLocaleLowerCase()) !== -1) &&
      value.id !== this.value.id);

    const forkAr = this.dictionary.filter(value =>
      (value.domain.toLocaleLowerCase().indexOf(this.value.domain.toLocaleLowerCase()) !== -1) &&
      (value.range.toLocaleLowerCase().indexOf(this.value.range.toLocaleLowerCase()) === -1));

    const final = forkAr.filter(value => !duplicate.includes(value));
    let isAdded = false;

    for (const i in final) {
      if (final[i].id !== this.value.id) { // only if the id is different from the id considered
        this.value.fork.push(final[i].id);
        isAdded = true;
      }
      if (final[i].id !== this.value.id) { // only if the id is different from the id considered
        final[i].fork.push(this.value.id);
        isAdded = true;
      }

    }

    if (isAdded) {
      this.messageService.add(new Message(
        'There is a fork, your entry domain correspond to other data domains already present. Click on the ' +
        'the icon to see more details', false));
    }

  }

  /**
   * set cycle array empty, through findIndex it selects only the rows("AA", "BB") that are in cycles("BB", "AA") with selected value,
   * So, if there are cycles add the id of selected value to the matched cycle value and the id of the matched cycle to
   * the selected value, finally if there are one o more matches add a new message, finally if there are one o more matches
   * add a new message
   */
  private cycles() {
    this.value.cycle = [];
    this.removeCycleRef();
    for (const i in this.dictionary) {
      this.dictionary[i].cycle = this.dictionary[i].cycle.filter(cycle => cycle !== this.value.id);
    }
    const findIndex = this.dictionary.findIndex(value => {
      if ((value.domain.toLocaleLowerCase().indexOf(this.value.range.toLocaleLowerCase()) !== -1) &&
        (value.range.toLocaleLowerCase().indexOf(this.value.domain.toLocaleLowerCase()) !== -1) &&
        value.id !== this.value.id) {
        this.value.cycle.push(value.id);
        value.cycle.push(this.value.id);
      }
    });
    if (findIndex !== -1) {
      this.messageService.add(new Message(
        'There is a cycle, your entry resulting in a never-ending transformation with other entries. Click on the ' +
        'the icon to see more details', true));
    }
  }

  /**
   * set chain array empty, through findIndex it selects only the value("AA", "FF") that are in chain("BB", "AA") with selected value,
   * So, if there are chain add the id of selected value to the matched chain value and the id of the matched chain to
   * the selected value, finally if there are one o more matches add a new message
   */
  private chain() {
    this.value.chain = [];
    this.removeChainRef();

    const cycle = this.dictionary.filter(value =>
      (value.domain.toLocaleLowerCase().indexOf(this.value.range.toLocaleLowerCase()) !== -1) &&
      (value.range.toLocaleLowerCase().indexOf(this.value.domain.toLocaleLowerCase()) !== -1) &&
      value.id !== this.value.id);

    const chainAr = this.dictionary.filter(value =>
      (value.range.toLocaleLowerCase().indexOf(this.value.domain.toLocaleLowerCase()) !== -1) ||
      (value.domain.toLocaleLowerCase().indexOf(this.value.range.toLocaleLowerCase()) !== -1));


    const final = chainAr.filter((value) => !cycle.includes(value));
    let isAdded = false;
    for (const i in final) {
      if (final[i].id !== this.value.id) { // only if the id is different from the id considered
        this.value.chain.push(final[i].id);
        isAdded = true;
      }
      if (final[i].id !== this.value.id) { // only if the id is different from the id considered
        final[i].chain.push(this.value.id);
        isAdded = true;
      }
    }


    if (isAdded) {
      this.messageService.add(new Message(
        'There is a chain, your entry range, or domain, appears in domain, or range, of other entries. Click on the ' +
        'the icon to see more details', true));
    }
  }

  /**
   * remove the id of the value updated/added/removed from all of the duplicate arrays of the dicitonary
   */
  private removeDuplicateRef() {
    for (const i in this.dictionary) {
      this.dictionary[i].duplicate = this.dictionary[i].duplicate.filter(duplicate => duplicate !== this.value.id);
    }
  }

  /**
   * remove the id of the value updated/added/removed from all of the fork arrays of the dicitonary
   */
  private removeForkRef() {
    for (const i in this.dictionary) {
      this.dictionary[i].fork = this.dictionary[i].fork.filter(fork => fork !== this.value.id);
    }
  }

  /**
   * remove the id of the value updated/added/removed from all of the cycle arrays of the dicitonary
   */
  private removeCycleRef() {
    for (const i in this.dictionary) {
      this.dictionary[i].cycle = this.dictionary[i].cycle.filter(cycle => cycle !== this.value.id);
    }
  }

  /**
   * remove the id of the value updated/added/removed from all of the chain arrays of the dicitonary
   */
  private removeChainRef() {
    for (const i in this.dictionary) {
      this.dictionary[i].chain = this.dictionary[i].chain.filter(chain => chain !== this.value.id);
    }
  }
}
