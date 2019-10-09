import {Component, OnInit} from '@angular/core';
import {Value} from '../value/value';
import {DictionaryService} from '../dictionary.service/dictionary.service';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalAddComponent} from '../modal.add.value/modal.add.value.component';
import {MessagesService} from '../messages.service/messages.service';


@Component({
  selector: 'app-dictionary.list',
  templateUrl: './dictionary.list.component.html',
  styleUrls: ['./dictionary.list.component.css']
})
export class DictionaryListComponent implements OnInit {

  dictionary: Value[];
  value: Value;
  isVisibleWarning: boolean;
  isVisibleError: boolean;
  duplicates: number[];
  forks: number[];
  chains: number[];
  cycles: number[];

  /**
   *
   * @param dictionarySer injection of DictionaryService to retrieve information about values
   * @param modal injection of the MatDialog service to import the dialog component from angular material
   * @param router is an implementation of a router service to manage the navigation with IssueModalComponent
   * @param route holds information about the route to this instance of HomeComponent
   */
  constructor(public dictionarySer: DictionaryService,
              public modal: MatDialog,
              public messageService: MessagesService,
              private router: Router,
              private route: ActivatedRoute) {
  }


  /**
   *  A dialog is opened by calling the open method with a component to be loaded and an optional
   *  config object. The open method will return an instance of MatDialogRef
   *  If the local storage is not accessible an alert is displayed
   */
  private openModal(): void {
    this.messageService.clear();
    const modalRef = this.modal.open(ModalAddComponent, {
      width: '600px',
      height: '400px'
    });

    // MatDialogRef provides a handle on the opened dialog.
    // It can be used to close the dialog and to receive notification
    // when the dialog has been closed. In this case is used
    // to navigate to and from “/dictionary-list/add-modal” in the router
    modalRef.afterClosed().subscribe(res => {
      this.router.navigate(['../'], {relativeTo: this.route});
      this.messageService.clear();
      this.dictionary = this.dictionarySer.getDictionary();
      this.removeEditable();
    });
  }


  /**
   * call method removeDictionary in DictionaryService to remove value to the dictionary and
   * then update the dictionary for update the view
   * @param {Value} value that user want to delete
   */
  private deleteValue(value: Value) {
    this.dictionarySer.removeValue(value);
    this.dictionary = this.dictionarySer.getDictionary();
    this.removeEditable();
    this.messageService.clear();

  }

  /**
   * start editing domain when user click on an domain input
   * @param {number} id is the id of the domain value that user wants to change
   * @param {MouseEvent} trigger event when user click on the input
   */

  startEditDom(id: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const index = this.dictionary.findIndex(value => value.id === id); // find index of this value in the dictionary
    this.removeEditable();
    this.dictionary[index].domIsEditable = true; // set enable to edit input in the dictionary
    this.messageService.clear();
  }

  /**
   * start editing range when user click on an range input
   * @param {number} id is the id of the range value that user wants to change
   * @param {MouseEvent} trigger event when user click on the input
   */
  startEditRan(id: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const index = this.dictionary.findIndex(value => value.id === id); // find index of this value in the dictionary
    this.removeEditable();
    this.dictionary[index].ranIsEditable = true; // set enable to edit input in the dictionary
    this.messageService.clear();
  }

  /**
   * submit value to the DictionaryService and then update the dictionary
   * @param {Value} value inserting by the user
   */
  async submitValue(value: Value) {
    this.value = value;
    this.dictionarySer.setValue(this.value);  // call addValue from the service
    this.removeEditable();
    this.dictionary = this.dictionarySer.getDictionary();
    await this.delay(4000);
    this.messageService.clear(); // delay 3 seconds to clear messages
  }

  /**
   * remove Editable flag of all component in the dictionary
   */
  private removeEditable() {
    for (const key in this.dictionary) {
      if (this.dictionary[key].domIsEditable || this.dictionary[key].ranIsEditable) {
        this.dictionary[key].domIsEditable = false;
        this.dictionary[key].ranIsEditable = false;
      }
    }
  }

  /**
   * When user click on problem button the view shows a modal, if user clicks on warning button the modal shows duplicates and forks,
   * while if users clicks on error button the modal shows chains and ccycles
   * @param {boolean} type the button clicked
   * @param {Value} value the value clicked
   */
  onModal(type: boolean, value: Value) {
    if (!type) {
      this.isVisibleWarning = true;
      this.duplicates = value.duplicate;
      this.forks = value.fork;
    }
    if (type) {
      this.isVisibleError = true;
      this.chains = value.chain;
      this.cycles = value.cycle;
    }
  }

  delay(milliseconds: number): Promise<number> {
    return new Promise<number>(resolve => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }

  ngOnInit() {
    this.dictionary = this.dictionarySer.getDictionary();
    this.removeEditable();
    this.isVisibleWarning = false;
    this.isVisibleError = false;
  }


}
