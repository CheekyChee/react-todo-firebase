import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { TodoComponent } from './components/todo';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-orange-300 to-orange-500 flex justify-center items-center`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-md overflow-hidden p-4 `,
  header: `text-2xl font-bold text-gray-900 p-2 text-center`,
  form: `flex justify-between   p-2`,
  input: `border p-2 w-full text-xl rounded-md`,
  button: `border p-4 ml-2 text-xl rounded-md bg-orange-200 text-slate-800`,
  count: `text-center p-2 mt-2 text-xl text-gray-900 `,
};

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [input, setInput] = useState<string>('');
  const [editText, setEditText] = useState<string>('');

  // create todo
  const createTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '') return alert('Please enter a todo');
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
    });
    setInput('');
  };

  // read todos from firebase
  useEffect(() => {
    const q = query(collection(db, 'todos'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todoArr = [] as Array<Todo>;
      querySnapshot.forEach((doc) => {
        todoArr.push({ ...doc.data(), id: doc.id } as Todo);
      });
      setTodos(todoArr);
    });
    return unsubscribe;
  }, []);

  // update todo in firebase
  const toggleComplete = async (todo: Todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    });
  };

  const editTodoSubmit = async (todo: Todo, text: string) => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        text: text,
      });
      if (text.trim() === '') {
        throw new Error('Text cannot be empty');
      }
    } catch (error) {
      alert("Can't update todo");
    }
  };

  // delete todo from firebase
  const deleteTodo = async (todo: Todo) => {
    await deleteDoc(doc(db, 'todos', todo.id));
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.header}>Todo App</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type="text"
            placeholder="Add Todo "
          />
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => {
            return (
              <TodoComponent
                todo={todo}
                cbEditTodo={(text) => {
                  setEditText(text);
                }}
                cbSubmitEdit={(submit) => {
                  if (submit && editText !== '') {
                    editTodoSubmit(todo, editText);
                  } else if (editText === '') {
                    alert('Please enter a todo');
                  }
                }}
                cbToggleComplete={toggleComplete}
                cbDeleteTodo={deleteTodo}
                key={index}
                index={index}
              />
            );
          })}
        </ul>
        <p className={style.count}>{`You have ${todos.length} todos`}</p>
      </div>
    </div>
  );
}

export default App;
