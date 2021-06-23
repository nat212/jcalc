import { ApplicationRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private readonly updates: SwUpdate, private readonly appRef: ApplicationRef, private readonly snackbar: MatSnackBar) {}

  public subscribeForUpdates() {
    if (environment.production) {
      const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
      const every30Seconds$ = interval(30 * 1000);
      const every30SecondsOnceAppIsStable$ = concat(appIsStable$, every30Seconds$);
      every30SecondsOnceAppIsStable$.subscribe(() => {
        this.updates.checkForUpdate();
      });
    }
    this.updates.available.subscribe(() => {
      this.openSnackbar();
    });
  }

  public update() {
    this.updates.activateUpdate();
    document.location.reload();
  }

  private openSnackbar() {
    this.snackbar
      .open('Update Available', 'UPDATE')
      .onAction()
      .subscribe(() => {
        this.update();
      });
  }
}
