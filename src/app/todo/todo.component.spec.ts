import { TodoComponent } from './todo.component';
import { TodoService } from './shared/todo.service';
import { AngularFireList } from '@angular/fire/database';
import { of } from 'rxjs';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let todoService: jasmine.SpyObj<TodoService>;
  let list: jasmine.SpyObj<AngularFireList<any>>;

  beforeEach(() => {
    todoService = jasmine.createSpyObj([
      'getTodoList',
      'addTitle',
      'removeTitle',
      'checkOrUncheckTitle',
    ]);
    list = jasmine.createSpyObj(['snapshotChanges']);
    todoService.getTodoList.and.returnValue(list);
    list.snapshotChanges.and.returnValue(
      of([
        {
          key: '1',
          payload: {
            toJSON: () => ({ isChecked: true, title: 'Task 1' }),
          },
        },
        {
          key: '2',
          payload: {
            toJSON: () => ({ isChecked: false, title: 'Task 3' }),
          },
        },
        {
          key: '3',
          payload: {
            toJSON: () => ({ isChecked: true, title: 'Task 3' }),
          },
        },
      ])
    );
    component = new TodoComponent(todoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    component.ngOnInit();
    expect(todoService.getTodoList).toHaveBeenCalled();
  });

  it('should order todos', () => {
    component.ngOnInit();
    expect(component.todoListArray).toEqual([
      { isChecked: false, title: 'Task 3', $key: '2' },
      { isChecked: true, title: 'Task 1', $key: '1' },
      { isChecked: true, title: 'Task 3', $key: '3' },
    ]);
  });

  it('should add todo', () => {
    component.onAdd({ value: 'Task 5' });
    expect(todoService.addTitle).toHaveBeenCalledWith('Task 5');
  });

  it('should remove todo', () => {
    component.onDelete('1');
    expect(todoService.removeTitle).toHaveBeenCalledWith('1');
  });

  it('should toggle completed', () => {
    component.alterCheck('1', false);
    expect(todoService.checkOrUncheckTitle).toHaveBeenCalledWith('1', true);
  });
});
