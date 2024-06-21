import { Injectable, inject } from '@angular/core';
import { user } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  http: HttpClient = inject(HttpClient);

  loginUser(userData: user) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.LOGIN, userData);
  }

  registerUser(userData: FormData) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.REGISTER, userData);
  }
  getStudentMarks(id: string) {
    return this.http.get(`${API_ROUTES.BASE_URL}${API_ROUTES.MARKS}/${id}`);
  }
  getAllStudents() {
    return this.http.get(
      `${API_ROUTES.BASE_URL}${API_ROUTES.GET_ALL_STUDENTS}`
    );
  }
  getAllUsers() {
    return this.http.get(`${API_ROUTES.BASE_URL}${API_ROUTES.GET_ALL_USERS}`);
  }
  changeRole(id: string, role: string) {
    return this.http.put(
      `${API_ROUTES.BASE_URL}${API_ROUTES.CHANGE_ROLE}/${id}`,
      { role: role }
    );
  }
  updateMarks(id: string, marks: number) {
    console.log('sdddsddssssssssssssss', id, marks);
    console.log(`${API_ROUTES.BASE_URL}${API_ROUTES.UPDATE_MARKS}/${id}`);

    return this.http.put(
      `${API_ROUTES.BASE_URL}${API_ROUTES.UPDATE_MARKS}/${id}`,
      { marks: marks }
    );
  }
  constructor() {}
}
