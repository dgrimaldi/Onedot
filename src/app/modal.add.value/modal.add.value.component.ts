import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Value} from '../value/value';
import {DictionaryService} from '../dictionary.service/dictionary.service';
import {MessagesService} from '../messages.service/messages.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-modal.add.value',
  templateUrl: './modal.add.value.component.html',
  styleUrls: ['./modal.add.value.component.css']
})
export class ModalAddComponent implements OnInit {
  addValueForm: FormGroup;
  value: Value;


  constructor(private formBuider: FormBuilder,
              public modalRef: MatDialogRef<ModalAddComponent>,
              private service: DictionaryService,
              public messageService: MessagesService,
              private nzMessageService: NzMessageService) {
  }

  /**
   * it checks if all fields are corrected create an object Value,
   *  then pass this object to the DictionaryService before to check if there is validation problem
   *  and then adding the value to the dictionary, if there is validation problem the function it displays
   *  the validation problem modal
   * modal
   * @param data fetches the information of the fields in the modal
   */
  submitForm(data) {
    for (const i in this.addValueForm.controls) {
      this.addValueForm.controls[i].markAsDirty();
      this.addValueForm.controls[i].updateValueAndValidity();
    }

    if (this.addValueForm.valid) {
      this.value = new Value( // creation of object Value
        data.domain,
        data.range,
      )
      this.service.addValue(this.value);  // call addValue from the service
      this.modalRef.close();
    }
  }

  ngOnInit() {
    this.addValueForm = this.formBuider.group({
      domain: [null, [Validators.required]],
      range: [null, [Validators.required]]
    });
  }
}
