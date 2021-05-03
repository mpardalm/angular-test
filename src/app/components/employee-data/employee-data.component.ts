import { Component, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Employee } from 'src/app/models/Employee';
import { ServiceAppService } from 'src/app/services/service-app';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.scss'],
})
export class EmployeeDataComponent implements OnInit {
  private event: EventEmitter<any> = new EventEmitter();

  mode: string;
  employee: Employee;
  formGroupData: FormGroup;
  positions: string[] = [];
  list: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private serviceApp: ServiceAppService
  ) {}

  ngOnInit(): void {
    this.employee = this.list[0];
    this.loadPositions();
    this.initForm();
  }

  async loadPositions() {
    const data = await this.serviceApp.getPositions().toPromise();
    this.positions = data['positions'];
  }

  initForm() {
    this.formGroupData = this.formBuilder.group({
      name: [this.employee?.name ?? '', [Validators.required]],
      surname: [this.employee?.surname ?? '', [Validators.required]],
      workPosition: [this.employee?.workPosition ?? '', [Validators.required]],
      birthDate: [this.employee?.birthDate ?? '', [Validators.required, , this.validateMaxDate]],
    });
  }

  validateMaxDate(control: AbstractControl) {
    const date = new Date().toLocaleDateString().split('/');
    const maxDateValid = `${date[2]}-${date[1]}-${date[0]}`;
    return control.value > maxDateValid ? { notValidDate: true } : null;
  }

  saveEmployee() {
    if (this.formGroupData.controls.birthDate.value > this.maxDate()) {
      this.formGroupData.invalid;
    } else {
      const employee = {
        id: this.employee?.id ?? undefined,
        name: this.formGroupData.controls.name.value,
        surname: this.formGroupData.controls.surname.value,
        workPosition: this.formGroupData.controls.workPosition.value,
        birthDate: this.formGroupData.controls.birthDate.value
      };
      this.event.emit(employee);
      this.bsModalRef.hide();
    }
  }

  cancel() {
    Swal.fire({
      title: 'Form will be closed',
      text: 'Do you want to continue?',
      icon: 'warning',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        this.bsModalRef.hide();
      }
    });
  }

  maxDate() {
    const date = new Date().toLocaleDateString().split('/');
    return `${date[2]}-${date[1]}-${date[0]}`;
  }
}
