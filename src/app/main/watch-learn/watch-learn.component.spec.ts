import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchLearnComponent } from './watch-learn.component';

describe('WatchLearnComponent', () => {
  let component: WatchLearnComponent;
  let fixture: ComponentFixture<WatchLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
