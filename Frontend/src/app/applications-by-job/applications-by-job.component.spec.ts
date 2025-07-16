import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsByJobComponent } from './applications-by-job.component';

describe('ApplicationsByJobComponent', () => {
  let component: ApplicationsByJobComponent;
  let fixture: ComponentFixture<ApplicationsByJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsByJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsByJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
