import { TestBed, async } from '@angular/core/testing';

import { TodoService } from './todo.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { of } from 'rxjs';

describe('TodoService', () => {
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
            toJSON: () => ({ isChecked: true, title: 'Task 1' }),
          },
        },
      ])
    );
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AngularFireDatabase,
          useValue: fireDb,
        },
      ],
    });
  }));

  it('should be created', () => {
    const service: TodoService = TestBed.get(TodoService);
    expect(service).toBeTruthy();
  });
});
