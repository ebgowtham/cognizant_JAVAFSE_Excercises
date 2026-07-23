import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { CourseDetailComponent } from './course-detail.component';
import { of } from 'rxjs';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => '101'
    }),
    snapshot: {
      paramMap: {
        get: (key: string) => '101'
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
