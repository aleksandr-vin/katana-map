import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import * as katanaLocationsData from '../../assets/katana-locations.json';
import { Data } from '../katana.service';


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let x = katanaLocationsData as unknown as Data;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: []
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render locations catalog size', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-chip-option')?.textContent).toContain(`${x.data.length}`);
  });
});
