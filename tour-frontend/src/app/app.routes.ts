import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/home/pages/home-page/home-page.component').then((m) => m.HomePageComponent) },
      { path: 'destinations', loadComponent: () => import('./features/voyages/pages/destinations-page/destinations-page.component').then((m) => m.DestinationsPageComponent) },
      { path: 'circuits', loadComponent: () => import('./features/voyages/pages/tours-page/tours-page.component').then((m) => m.ToursPageComponent) },
      { path: 'reservation', loadComponent: () => import('./features/reservations/pages/booking-page/booking-page.component').then((m) => m.BookingPageComponent) },
      { path: 'mes-reservations', loadComponent: () => import('./features/reservations/pages/my-reservations-page/my-reservations-page.component').then((m) => m.MyReservationsPageComponent) },
      { path: 'a-propos', loadComponent: () => import('./features/home/pages/about-page/about-page.component').then((m) => m.AboutPageComponent) },
      { path: 'contact', loadComponent: () => import('./features/home/pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent) },
      { path: '**', redirectTo: '' },
    ],
  },
];
