import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { of } from 'rxjs';
describe('AppComponent', () => {
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
      declarations: [AppComponent, TodoComponent],
      providers: [
        {
          provide: AngularFireDatabase,
          useValue: fireDb,
        },
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'todo-app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('todo-app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain(
      'To Do List App'
    );
  }));
});
