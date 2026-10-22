import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageStatusPanelComponent } from './page-status-panel.component';

describe('PageStatusPanelComponent', () => {
  let component: PageStatusPanelComponent;
  let fixture: ComponentFixture<PageStatusPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageStatusPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageStatusPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
