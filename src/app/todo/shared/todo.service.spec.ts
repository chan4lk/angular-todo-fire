import { TodoService } from './todo.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

describe('TodoService', () => {
  let fireDb: jasmine.SpyObj<AngularFireDatabase>;
  let list: jasmine.SpyObj<AngularFireList<any>>;
  let service: TodoService;

  beforeEach(() => {
    fireDb = jasmine.createSpyObj(['list']);
    list = jasmine.createSpyObj([
      'update',
      'remove',
      'push',
      'snapshotChanges',
    ]);
    fireDb.list.and.returnValue(list);
    service = new TodoService(fireDb);
    service.getTodoList();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init todos', () => {
    expect(service.todoList).toBeTruthy();
  });

  it('should add todo', () => {
    service.addTitle('Task 2');
    expect(list.push).toHaveBeenCalledWith({
      isChecked: false,
      title: 'Task 2',
    });
  });

  it('should remove todo', () => {
    service.removeTitle('1');
    expect(list.remove).toHaveBeenCalledWith('1');
  });

  it('should toggle todo', () => {
    service.checkOrUncheckTitle('1', true);
    expect(list.update).toHaveBeenCalledWith('1', { isChecked: true });
  });
});
