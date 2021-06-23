import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

interface InstallPromptData {
  event: any;
}

@Component({
  templateUrl: './install-prompt.component.html',
  styleUrls: ['./install-prompt.component.scss'],
})
export class InstallPromptComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: InstallPromptData,
    private readonly sheetRef: MatBottomSheetRef<InstallPromptComponent>,
  ) {}

  public install() {
    this.data.event.prompt();
    this.close();
  }

  public close() {
    this.sheetRef.dismiss();
  }
}
