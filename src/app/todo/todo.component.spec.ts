import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoComponent } from './todo.component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { of } from 'rxjs';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let fireDb: jasmine.SpyObj<AngularFireDatabase>;
  let list: jasmine.SpyObj<AngularFireList<any>>;
  beforeEach(async(() => {
    fireDb = jasmine.createSpyObj(['list']);
    list = jasmine.createSpyObj([
      'update',
      'remove',
      'push',
      'snapshotChanges',
    ]);
    fireDb.list.and.returnValue(list);
    list.snapshotChanges.and.returnValue(
      of([
        {
          payload: {
            toJSON: () => ({ isChecked: true, title: 'Task 1', key: '1' }),
          },
        },
        {
          payload: {
            toJSON: () => ({ isChecked: false, title: 'Task 2', key: '2' }),
          },
        },
      ])
    );
    TestBed.configureTestingModule({
      declarations: [TodoComponent],
      providers: [
        {
          provide: AngularFireDatabase,
          useValue: fireDb,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add item', () => {
    const compiled = fixture.debugElement.nativeElement;
    const button = compiled.querySelector('input~div');
    button.click();
    expect(list.push).toHaveBeenCalled();
  });

  it('should toggle task complete', () => {
    const compiled = fixture.debugElement.nativeElement;
    const checkbox = compiled.querySelector('.list-group-item>span');
    checkbox.click();
    expect(list.update).toHaveBeenCalled();
  });

  it('should remove task', () => {
    const compiled = fixture.debugElement.nativeElement;
    const deleteButton = compiled.querySelector(
      '[data-automation-id="delete-1"]'
    );
    deleteButton.click();
    expect(list.remove).toHaveBeenCalled();
  });
});
