import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private stashedEvent: Event;

  constructor(private readonly bottomSheet: MatBottomSheet) {}

  public checkInstall() {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.stashedEvent = event;
      this.openPrompt(event);
    });
  }

  private openPrompt(event: Event) {
    this.bottomSheet.open(InstallPromptComponent, { data: { event } });
  }
}
