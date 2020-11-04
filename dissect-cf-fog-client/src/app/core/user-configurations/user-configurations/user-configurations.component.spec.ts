import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { UserConfigurationService } from 'src/app/services/configuration/user-configuration/user-configuration.service';
import { UserConfigurationsComponent } from './user-configurations.component';

describe('UserConfigurationsComponent', () => {
  let component: UserConfigurationsComponent;
  let fixture: ComponentFixture<UserConfigurationsComponent>;
  let userConfigurationsDetails: Subject<void>;

  beforeEach(async(() => {
    userConfigurationsDetails = new Subject();
    TestBed.configureTestingModule({
      declarations: [UserConfigurationsComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserConfigurationService, useValue: { userConfigurationsDetails$: userConfigurationsDetails } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
