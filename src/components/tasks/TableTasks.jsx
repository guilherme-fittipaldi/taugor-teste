import React, { useState, useEffect } from "react";
import EditTask from "./EditTask.jsx";
import firebase from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

function TableTasks({ status, description }) {
  const { currentUser } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [edit, setEdit] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [editTask, setEditTask] = useState({});

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Task")
      .onSnapshot((snapshot) => {
        const newTask = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllTasks(newTask);
      });
    return () => unsubscribe();
  }, []);

  function handleEdit(e) {
    setEdit(true);
    setIdEdit(e.target.parentElement.id);
  }

  useEffect(() => {
    if (idEdit !== null)
      setEditTask(allTasks.find((task) => task.id === idEdit));
  }, [idEdit]);

  return (
    <div style={{ overflowY: "scroll", height: "400px" }}>
      <table>
        <tr>
          <th>Titulo</th>
          <th>Descrição</th>
          <th>Status</th>
          <th>Usuário</th>
          <th>Arquivo</th>
          <td></td>
        </tr>
        {allTasks.map(
          (task) =>
            task.status === status &&
            task.user === currentUser.email &&
            task.description.includes(description) && (
              <tr key={task.id} id={task.id}>
                <td className="task">
                  <a href={task?.fileUrl}>{task?.title}</a>
                </td>
                <td className="task">{task?.description}</td>
                <td className="task">{task?.status}</td>
                <td className="task">{task?.user}</td>
                <td className="task">
                  <a href={task?.fileUrl}>Arquivo</a>
                </td>
                <td onClick={handleEdit}>Editar</td>
              </tr>
            )
        )}
        {allTasks.map(
          (task) =>
            status === "Todos" &&
            task.user === currentUser.email &&
            task.description.includes(description) && (
              <tr key={task.id} id={task.id}>
                <td>{task?.title}</td>
                <td className="task">{task?.description}</td>
                <td className="task">{task?.status}</td>
                <td className="task">{task?.user}</td>
                <td className="task">
                  <a href={task?.fileUrl} target="_blank">
                    Arquivo
                  </a>
                </td>
                <td onClick={handleEdit}>Editar</td>
              </tr>
            )
        )}
      </table>
      {edit && editTask ? (
        <EditTask edit={edit} editTask={editTask} setEdit={setEdit} />
      ) : null}
    </div>
  );
}

export default TableTasks;
