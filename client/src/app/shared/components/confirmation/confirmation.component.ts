import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ConfirmationOptions} from './confirmation-options.interface';

@Component({
  selector: 'jgb-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public inputOptions: Partial<ConfirmationOptions>
  ) {}

  defaultOptions: ConfirmationOptions = {
    header: 'Are you sure?',
    confirm: 'Remove',
    negate: 'Cancel'
  };

  options: ConfirmationOptions;

  ngOnInit() {
    this.options = {
      ...this.defaultOptions,
      ...(this.inputOptions || {})
    };
  }
}
