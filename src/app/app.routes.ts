import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { Subjects } from './pages/subjects/subjects';
import { Questions } from './pages/questions/questions';
import { Exams } from './pages/exams/exams';
import { StudentExams } from './pages/student-exams/student-exams';
import { Students } from './pages/students/students';
import { Dashboard } from './pages/dashboard/dashboard';
import { Unauthorized } from './pages/unauthorized/unauthorized';
import { Notfound } from './pages/notfound/notfound';
import { AuthGuard } from './services/auth/auth-guard';
import { AuthPagesGuard } from './services/auth/auth-pages-guard';
import { SubjectConfigurations } from './pages/subject-configurations/subject-configurations';
import { PreviewExam } from './pages/preview-exam/preview-exam';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'subjects/questions/:subjectId',
    component: Questions,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Admin' },
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'exams',
    component: Exams,
  },
  {
    path: 'exams/:subjectId',
    component: StudentExams,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Student' },
  },
  {
    path: 'students',
    component: Students,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Admin' },
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Admin' }
  },
  {
    path:'dashboard/Configurations',
    component: SubjectConfigurations,
     canActivate: [AuthGuard],
    data: { expectedRole: 'Admin' },
  },
  {
    path:'preview/exams/:examId',
    component: PreviewExam
  },
  {
    path: 'unauthorized',
    component: Unauthorized,
  },
  {
    path: 'login',
    component: Login,
    canActivate: [AuthPagesGuard],
  },
  {
    path: 'register',
    component: Signup,
    canActivate: [AuthPagesGuard],
  },
  {
    path: 'subjects',
    component: Subjects,
  },
  {
    path: '**',
    component: Notfound,
  },
];
