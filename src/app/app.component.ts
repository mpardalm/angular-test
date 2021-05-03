import { Component, OnInit } from '@angular/core';
import { EmployeeDataComponent } from './components/employee-data/employee-data.component';
import { Employee } from './models/Employee';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { FireStoreServiceService } from './services/fire-store-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  modalRef: BsModalRef;

  searchText: string;

  employeesList: Employee[] = [];
  employeesListAuxFilter: Employee[];

  constructor(private modalService: BsModalService, private fireStoreService: FireStoreServiceService) {}

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.fireStoreService.getEmployees().subscribe(data => {
      this.employeesList = [];
      data.forEach(d => {
        const employee: any = d.payload.doc.data();
        employee['id'] = d.payload.doc.id;
        this.employeesList.push(employee);
      });
      this.employeesListAuxFilter = [...this.employeesList];
    });
  }

  filterEmployee() {
    this.employeesList = this.employeesListAuxFilter.filter(
      (employee: Employee) =>
        employee.name
          .toLocaleLowerCase()
          .includes(this.searchText.toLocaleLowerCase())
    );
  }

  openModalEmployee(mode: string, employee: Employee = undefined) {
    this.searchText = '';
    if (this.employeesList.length) {
      this.employeesList = [...this.employeesListAuxFilter];
    }
    const initialState = {
      list: [employee],
    };
    this.modalRef = this.modalService.show(EmployeeDataComponent, {
      initialState,
      backdrop: 'static',
      keyboard: false,
    });
    this.modalRef.content.mode = mode;
    this.modalRef.content.event.subscribe((employeeResponse: Employee) => {
      if (!employeeResponse.id) {
        this.createNewEmployee(employeeResponse);
      } else {
        this.updateEmployee(employeeResponse);
      }
    });
  }

  updateEmployee(employeeResponse: Employee) {
    this.fireStoreService.updateEmployee(employeeResponse);
  }

  createNewEmployee(employee: Employee) {
    this.fireStoreService.createEmployee(employee);
  }

  removeEmployee(id: string) {
    Swal.fire({
      title: 'Remove',
      text: 'Employee will be removed, continue?',
      icon: 'error',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        this.fireStoreService.deleteEmployee(id);
      }
    });
  }
}
