import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureWidgetComponent } from './configure-widget.component';

describe('ConfigureWidgetComponent', () => {
  let component: ConfigureWidgetComponent;
  let fixture: ComponentFixture<ConfigureWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
