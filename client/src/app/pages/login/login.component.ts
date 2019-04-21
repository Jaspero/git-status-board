import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {auth} from 'firebase';
import {from} from 'rxjs';
import {filter} from 'rxjs/operators';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jgb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public fb: FormBuilder
  ) {}

  @ViewChild('password') passwordField: ElementRef;

  loginForm: FormGroup;

  ngOnInit() {
    this.afAuth.user.pipe(filter(user => !!user)).subscribe(() => {
      this.router.navigate(['/board/1']);
    });

    this.buildForm();
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginEmail() {
    const data = this.loginForm.getRawValue();
    from(
      this.afAuth.auth.signInWithEmailAndPassword(
        data.emailLogin,
        data.passwordLogin
      )
    )
      .pipe(
        notify({
          success: 'You are now logged in',
          error:
            'The email and password you entered did not match our records. Please double-check and try again.'
        })
      )
      .subscribe(
        () => {},
        () => {
          this.loginForm.get('passwordLogin').reset();
          this.passwordField.nativeElement.focus();
        }
      );
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', Validators.required]
    });
  }
}
