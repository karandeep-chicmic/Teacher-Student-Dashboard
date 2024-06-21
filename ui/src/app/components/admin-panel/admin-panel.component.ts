import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { ApiCallsService } from '../../services/api-calls.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  allUsers: any[] = [];
  apiCalls: ApiCallsService = inject(ApiCallsService);
  ngOnInit(): void {
    this.apiCalls.getAllUsers().subscribe((data: any) => {
      console.log(data);
      this.allUsers = data.data;
    });
  }

  onRoleChange(event: any, userId: string) {
    // console.log(event.target.value, userId);
    const role = event.target.value;
    this.apiCalls.changeRole(userId, String(role)).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  constructor() {}
}
