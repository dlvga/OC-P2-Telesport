import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoadShellComponent } from './page-load-shell.component';

describe('PageLoadShellComponent', () => {
  let component: PageLoadShellComponent;
  let fixture: ComponentFixture<PageLoadShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLoadShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLoadShellComponent);
    component = fixture.componentInstance;
    component.loadState = 'loading';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
