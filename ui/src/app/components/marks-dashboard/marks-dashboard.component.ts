import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { ApiCallsService } from '../../services/api-calls.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-marks-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    JsonPipe,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './marks-dashboard.component.html',
  styleUrl: './marks-dashboard.component.css',
})
export class MarksDashboardComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  formBuilder: FormBuilder = inject(FormBuilder);

  studentMarks: any[] = [];
  allStudents: any[] = [];
  updateBtnClicked: boolean = false;
  student: boolean = false;
  form: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    const userRole: string = localStorage.getItem('role') ?? '';
    const id: string = localStorage.getItem('userId') ?? '';
    if (userRole != 'teacher') {
      this.student = true;
      this.apiCalls.getStudentMarks(id).subscribe({
        next: (res: any) => {
          this.studentMarks = res.data;
          console.log(res);
        },
        error: (err) => {
          console.log('ERROR is: ', err);
          this.sweetAlert.error(err.error);
        },
      });
    } else {
      // this.apiCalls.getAllStudents().subscribe({
      //   next: (data: any) => {
      //     this.allStudents = data.data;
      //     console.log(this.allStudents);
      //   },
      //   error: (err) => {
      //     console.log('ERROR IS : ', err);
      //   },
      // });
      this.setAllStudents();
    }
  }

  setAllStudents() {
    this.apiCalls.getAllStudents().subscribe({
      next: (data: any) => {
        this.allStudents = data.data;
        console.log(this.allStudents);
      },
      error: (err) => {
        console.log('ERROR IS : ', err);
      },
    });
  }

  updateBtn(marks: any) {
    console.log('update button clicked');
    console.log(marks);
    this.updateBtnClicked = true;
    this.form = this.formBuilder.group({
      marks: this.formBuilder.array(
        marks.map((mark: any) => {
          return this.formBuilder.group({
            _id: [mark._id],
            studentId: [mark.studentId],
            subject: [{ value: mark.subject, disabled: true }],
            marks: [mark.marks],
          });
        })
      ),
    });
  }
  get marksArray(): FormArray {
    return this.form.get('marks') as FormArray;
  }

  onSubmit() {
    console.log(this.form.value.marks);

    const requests = this.form.value.marks.map((element: any) => {
      return this.apiCalls.updateMarks(element._id, element.marks);
    });

    Promise.all(requests)
      .then((responses) => {
        responses.forEach((response, index) => {
          response.subscribe({
            next: (data: any) => {
              this.sweetAlert.success(
                `Marks for ${this.form.value.marks[index].subject} updated successfully`
              );
              this.setAllStudents();
            },
            error: (err: Error) => {
              this.sweetAlert.error(
                `Failed to update marks for ${this.form.value.marks[index].subject}`
              );
            },
          });
        });
        this.updateBtnClicked = false;
      })
      .catch((error) => {
        console.error('Error updating marks:', error);
        this.sweetAlert.error('An error occurred while updating marks');
      });
  }
}
