import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Tasks from "./tasks/Tasks.jsx";
import AddTask from "./tasks/AddTask.jsx";
import { AppBar, Tabs, Tab } from "@material-ui/core/";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [addTask, setAddTask] = useState(false);
  const { logout } = useAuth();
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
        <Tabs value={addTask ? 1 : 0} aria-label="simple tabs example">
          <Tab
            value="0"
            label="Listar Atividades"
            onClick={() => setAddTask(false)}
            aria-selected={!addTask}
          />
          <Tab
            value="1"
            label="Nova Atividade"
            onClick={() => setAddTask(true)}
            aria-selected={addTask}
          />
          <Tab value="2" onClick={handleLogout} label="Logout" />
        </Tabs>
      </AppBar>
      {error && <p>{error}</p>}
      <main>
        {addTask ? (
          <>
            <AddTask setAddTask={setAddTask} />{" "}
          </>
        ) : (
          <>
            <Tasks />{" "}
          </>
        )}
      </main>
    </>
  );
}
