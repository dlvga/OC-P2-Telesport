import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalChartComponent } from './medal-chart.component';

describe('MedalChartComponent', () => {
  let component: MedalChartComponent;
  let fixture: ComponentFixture<MedalChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
