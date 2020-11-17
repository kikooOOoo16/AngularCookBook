import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecipeItemEditComponent} from './recipe-item-edit.component';

describe('RecipeItemEditComponent', () => {
  let component: RecipeItemEditComponent;
  let fixture: ComponentFixture<RecipeItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeItemEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
