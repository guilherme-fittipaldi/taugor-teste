import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import TaskList from "./tasks/TaskList.jsx";
import AddTask from "./tasks/AddTask.jsx";
import { AppBar, Tabs, Tab } from "@material-ui/core/";
import { TabPanel } from "@material-ui/lab/";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [addTask, setAddTask] = useState(false);
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Falha ao deslogar");
    }
  }

  return (
    <>
      <AppBar>
        <Tabs aria-label="simple tabs example">
          <Tab label="Listar Atividades" onClick={() => setAddTask(false)} />
          <Tab label="Nova Atividade" onClick={() => setAddTask(true)} />
          <Tab onClick={handleLogout} label="Logout" />
        </Tabs>
      </AppBar>
      {error && <p>{error}</p>}
      <main>
        {addTask ? (
          <>
            <h2>Adicionar Atividade</h2> <AddTask setAddTask={setAddTask} />{" "}
          </>
        ) : (
          <>
            <h2>Lista de Atividades</h2> <TaskList />{" "}
          </>
        )}
      </main>
    </>
  );
}
