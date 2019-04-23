import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {finalize, map, take} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../../shared/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '../../enums/firestore-static-documents.enum';
import {Role} from '../../enums/role.enum';
import {Settings} from '../../interfaces/settings.interface';
import {notify} from '../../utils/notify.operator';

@Component({
  selector: 'jgb-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MembersComponent>
  ) {}

  form$: Observable<FormGroup>;
  loading$ = new BehaviorSubject(false);
  role = Role;

  ngOnInit() {
    this.form$ = this.afs
      .collection(FirestoreCollections.Settings)
      .doc(FirestoreStaticDocuments.GeneralSettings)
      .valueChanges()
      .pipe(
        take(1),
        map((value: Settings) => {
          return this.fb.group({
            members: this.fb.array(
              (value.members || []).map(member => this.mapMember(member))
            )
          });
        })
      );
  }

  getMembers(form: FormGroup) {
    return form.get('members') as FormArray;
  }

  mapMember(member: {email?: string; role?: Role} = {}) {
    return this.fb.group({
      email: [member.email || '', Validators.required],
      role: member.role || Role.Member
    });
  }

  addMember(form: FormGroup) {
    const members = form.get('members') as FormArray;
    members.push(this.mapMember());
  }

  removeMember(form: FormGroup, index: number) {
    const members = form.get('members') as FormArray;
    members.removeAt(index);
  }

  save(data, document = FirestoreStaticDocuments.GeneralSettings) {
    this.loading$.next(true);

    from(
      this.afs
        .collection(FirestoreCollections.Settings)
        .doc(document)
        .set(data, {
          merge: true
        })
    )
      .pipe(
        finalize(() => this.loading$.next(false)),
        notify()
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}