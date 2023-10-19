import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvmsplayerComponent } from './ivmsplayer.component';

describe('IvmsplayerComponent', () => {
  let component: IvmsplayerComponent;
  let fixture: ComponentFixture<IvmsplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IvmsplayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IvmsplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
