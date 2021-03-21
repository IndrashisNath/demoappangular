import { Component, OnInit, VERSION, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "./register.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //title = 'Registration';
  registerForm!: FormGroup;
  updateForm!: FormGroup;
  submitted = false;
  selected = false;
  search!: string;
  searchData: any;
  selectedItem: any;
  isSelected = false;

  displayedColumns: string[] = ['firstName', 'lastName', 'contact', 'birthday', 'address'];
  dataSource: any;
  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private _registerService: RegisterService,
    private http: HttpClient
    //private _userService: UserService

  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      contact: ["", Validators.required],
      birthday: ["", Validators.required],
      address: ["", Validators.required]
    });

    this.updateForm = this.formBuilder.group({
      id: ["", Validators.required], 
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      contact: ["", Validators.required],
      birthday: ["", Validators.required],
      address: ["", Validators.required]
    });
//this.searchData[0].firstName
    this.dataSource = new MatTableDataSource();

    this.http.get("http://localhost:3000/fetch")
      .subscribe((data) => this.dataSource = data);  

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }
  onOptionSelected(item: any) {
    if (item != null) {
      this.selectedItem = item;
      this.isSelected = true;
         this.updateForm.setValue({
          id: item.id,
        firstName: item.firstName,
        lastName : item.lastName,
        contact : item.contact,
        birthday : item.birthday,
        address : item.address
    });
    }
    else
      this.isSelected = false;
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value);
    this._registerService
      .register(this.registerForm.value)
      .subscribe(
        (response: any) => /*console.log("Success!", response)*/document.location.reload(),
        (error: any) => console.error("Error!", error)
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //todo post with service
  onSearch() {
    this.http.post("http://localhost:3000/search",{searchq: this.search})
      .subscribe((data) => this.searchData = data);

   
  }

  //todo post without service 
  // onSubmit() {
  //   this.http.post("http://localhost:3000/search",{searchq: this.search})
  //     .subscribe((data) => this.searchData = data);
  // }

  reset() {
    this.registerForm.reset();
  }

  onUpdate() {
    // var id = this.selectedItem.id;
    // this.selectedItem = this.updateForm.value;
    // this.selectedItem = id;
    this.http.post("http://localhost:3000/update",this.updateForm.value)
      .subscribe(
        (response: any) => /*console.log("Success!", response)*/document.location.reload(),
        (error: any) => console.error("Error!", error));
  }

  onDelete() {
    this.http.post("http://localhost:3000/delete",this.selectedItem)
      .subscribe(
        (response: any) => console.log("Success!", response),
        (error: any) => console.error("Error!", error));
  }
}
