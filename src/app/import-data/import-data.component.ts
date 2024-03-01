import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-import-data',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './import-data.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportDataComponent { }
