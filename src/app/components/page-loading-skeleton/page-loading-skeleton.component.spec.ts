import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoadingSkeletonComponent } from './page-loading-skeleton.component';

describe('PageLoadingSkeletonComponent', () => {
  let component: PageLoadingSkeletonComponent;
  let fixture: ComponentFixture<PageLoadingSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLoadingSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLoadingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
