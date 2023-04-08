import { FC, Fragment, useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { Todo } from '../App';
export interface TodoComponentProps {
  todo: Todo;
  index: number;
  cbToggleComplete: (todo: Todo) => void;
  cbDeleteTodo: (todo: Todo) => void;
  cbEditTodo: (text: string) => void;
  cbSubmitEdit: (todo: Todo) => void;
}

const style = {
  li: `flex justify-between items-center  p-4 border-b border-gray-300 capitalize min-w-full`,
  liCompleted: `flex justify-between items-center capitalize  min-w-full  bg-slate-400 p-4 border-b border-gray-300 `,
  row: `flex items-center`,
  text: `ml-2 cursor-pointer`,
  textCompleted: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  todoNo: `text-gray-500 pr-3`,
  editDelete: `flex items-center gap-2`,
  input:
    'shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
};

export const TodoComponent: FC<TodoComponentProps> = (props) => {
  const [editState, setEditState] = useState<boolean>(false);

  return (
    <Fragment>
      <li className={props.todo.completed ? style.liCompleted : style.li}>
        <div className={style.row}>
          <p className={style.todoNo}>{`${props.index + 1}.`}</p>

          {editState ? (
            <div className="flex items-center justify-start gap-2">
              <input
                type="text"
                key={props.todo.id}
                className={style.input}
                defaultValue={props.todo.text}
                onChange={(e) => {
                  props.cbEditTodo(e.target.value);
                }}
              />
              <button
                className="px-3 py-1.5 font-bold text-white bg-orange-500 rounded hover:bg-orange-300 focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  props.cbSubmitEdit(props.todo);
                  setEditState((prev) => !prev);
                }}
              >
                Submit
              </button>
              <button
                className="px-3 py-1.5 font-bold text-black bg-slate-200 rounded  focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setEditState((prev) => !prev);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <input
                type="checkbox"
                onChange={() => props.cbToggleComplete(props.todo)}
                checked={props.todo.completed ? true : false}
              />
              <p
                onClick={() => props.cbToggleComplete(props.todo)}
                className={
                  props.todo.completed ? style.textCompleted : style.text
                }
              >
                {props.todo.text}
              </p>
            </>
          )}
        </div>
        <div className={style.editDelete}>
          <button
            onClick={() => {
              // props.cbEditTodo();
              setEditState((prev) => !prev);
            }}
          >
            {<FaRegEdit />}
          </button>
          <button
            onClick={() => {
              props.cbDeleteTodo(props.todo);
            }}
          >
            {<FaRegTrashAlt />}
          </button>
        </div>
      </li>
    </Fragment>
  );
};
