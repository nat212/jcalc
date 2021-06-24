import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { PwaService } from './pwa.service';
import { UpdateService } from './update.service';

@Component({
  selector: 'jc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form: FormGroup;
  public natContr?: number;
  public krisContr?: number;
  public natLeft?: number;
  public krisLeft?: number;
  public totalContr?: number;

  constructor(private readonly formBuilder: FormBuilder, private readonly pwa: PwaService, private readonly update: UpdateService) {}

  private loadNum(key: string): number | null {
    const val = localStorage.getItem(key);
    return val ? parseFloat(val) : null;
  }

  private loadValues() {
    const needs = this.loadNum('needs');
    const natasha = this.loadNum('natasha');
    const kristen = this.loadNum('kristen');
    this.form.patchValue({ needs, kristen, natasha });
  }

  private persistValues(needs: number, kristen: number, natasha: number) {
    if (needs) {
      localStorage.setItem('needs', needs.toString());
    }
    if (kristen) {
      localStorage.setItem('kristen', kristen.toString());
    }
    if (natasha) {
      localStorage.setItem('natasha', natasha.toString());
    }
  }

  ngOnInit() {
    this.update.subscribeForUpdates();
    this.pwa.checkInstall();
    const val = Validators.compose([Validators.required, Validators.min(0)]);
    this.form = this.formBuilder.group({
      needs: [null, val],
      kristen: [null, val],
      natasha: [null, val],
    });
    this.form.valueChanges.subscribe(({ needs, kristen, natasha }) => this.persistValues(needs, kristen, natasha));
    this.form.valueChanges
      .pipe(filter(({ needs, kristen, natasha }) => !!needs && !!kristen && !!natasha))
      .subscribe(() => this.calculate());
    this.loadValues();
  }

  public calculate() {
    const { needs, kristen, natasha } = this.form.value;
    this.natContr = (natasha - kristen + needs) / 2;
    this.natLeft = natasha - this.natContr;
    this.krisContr = needs - this.natContr;
    this.krisLeft = kristen - this.krisContr;
    this.totalContr = this.krisContr + this.natContr;
  }

  public reset() {
    localStorage.clear();
    this.form.reset();
    this.natContr = undefined;
    this.natLeft = undefined;
    this.krisContr = undefined;
    this.krisLeft = undefined;
    this.totalContr = undefined;
  }
}
