import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    MatExpansionModule, MatIconModule, MatDividerModule, MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  esAdmin = false;
  private sub: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Actualiza el rol cada vez que cambia el usuario (login/logout)
    this.sub = this.authService.currentUser$.subscribe(user => {
      this.esAdmin = user?.rol === 'admin';
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
