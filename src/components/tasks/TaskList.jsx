import React, { useState, useEffect } from "react";
import TableTasks from "./TableTasks.jsx";

const TaskList = () => {
  const [status, setStatus] = useState("Todos");
  const [description, setDescription] = useState("");
  return (
    <div>
      <h2>Lista de Atividades</h2>
      <div style={{ display: "flex" }}>
        <div>
          <label>Procurar por descrição:</label>
          <input
            className="filterDesc"
            onChange={(e) => setDescription(e.currentTarget.value)}
            type="text"
          />
        </div>
        <div>
          <label>Status</label>
          {""}
          <select
            className="filterStatus"
            onChange={(event) => {
              setStatus(event.target.options[event.target.selectedIndex].text);
              console.log(
                event.target.options[event.target.selectedIndex].text
              );
            }}
          >
            <option value="all">Todos</option>
            <option value="pendent">Pendente</option>
            <option value="inProgress">Em andamento</option>
            <option value="finalized">Finalizada</option>
            <option value="canceled">Cancelada</option>
          </select>
        </div>
      </div>
      <TableTasks status={status} description={description} />
    </div>
  );
};

export default TaskList;
