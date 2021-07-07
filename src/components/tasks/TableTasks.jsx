import React, { useState } from "react";
import EditTask from "./EditTask.jsx";

function TableTasks({ showTasks }) {
  const [edit, setEdit] = useState(false);
  const [editTask, setEditTask] = useState({});

  function handleEdit(e) {
    setEdit(true);
    setEditTask(
      showTasks.find((task) => task.id === e.target.parentElement.id)
    );
  }

  return (
    <>
      {showTasks.length > 0 ? (
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
            {showTasks.map((task) => (
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
                <td
                  onClick={handleEdit}
                  style={{
                    color: "lightseagreen",
                    textDecoration: " underline",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </td>
              </tr>
            ))}
          </table>
          {edit && editTask ? (
            <EditTask edit={edit} editTask={editTask} setEdit={setEdit} />
          ) : null}
        </div>
      ) : (
        <p>Nenhuma atividade encontrada</p>
      )}
    </>
  );
}

export default TableTasks;
