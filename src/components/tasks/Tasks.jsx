import React, { useState, useEffect } from "react";
import TableTasks from "./TableTasks.jsx";
import firebase from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const Tasks = () => {
  const { currentUser } = useAuth();
  const [showTasks, setShowTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Task")
      .onSnapshot((snapshot) => {
        const newTask = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllTasks(newTask.filter((task) => task.user === currentUser.email));
        setShowTasks(newTask.filter((task) => task.user === currentUser.email));
      });
    return () => unsubscribe();
  }, []);

  function handleDescChange(e) {
    const query = e.currentTarget.value.toLowerCase();

    const status = idStatus.options[idStatus.selectedIndex].text;
    const aux = allTasks;
    if (query !== "") {
      if (status !== "Todos") {
        setShowTasks(
          allTasks.filter(
            (task) =>
              (task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query)) &&
              task.status === status
          )
        );
      } else {
        setShowTasks(
          allTasks.filter(
            (task) =>
              task.title.toLowerCase().includes(query) ||
              task.description.toLowerCase().includes(query)
          )
        );
      }
    } else if (status !== "Todos") {
      setShowTasks(
        allTasks.filter(
          (task) =>
            (task.title.toLowerCase().includes(query) ||
              task.description.toLowerCase().includes(query)) &&
            task.status === status
        )
      );
      setAllTasks(aux);
    }
  }

  function handleStatusChange(e) {
    const query = idQuery.value.toLowerCase();
    const newStatus = e.target.options[e.target.selectedIndex].text;
    const aux = allTasks;
    if (newStatus !== "Todos") {
      setShowTasks(
        allTasks.filter(
          (task) =>
            (task.title.toLowerCase().includes(query) ||
              task.description.toLowerCase().includes(query)) &&
            task.status === newStatus
        )
      );
      setAllTasks(aux);
    } else setShowTasks(allTasks);
  }

  return (
    <div>
      <br />
      <br />
      <br />
      <h2>Lista de Atividades</h2>
      <div style={{ display: "flex" }}>
        <div>
          <label>Pesquisar</label>
          <input
            className="filterDesc"
            id="idQuery"
            onChange={handleDescChange}
            type="text"
          />
        </div>
        <div>
          <label>Status</label>
          <select
            id="idStatus"
            className="filterStatus"
            onChange={handleStatusChange}
          >
            <option value="all">Todos</option>
            <option value="pendent">Pendente</option>
            <option value="inProgress">Em andamento</option>
            <option value="finalized">Finalizada</option>
            <option value="canceled">Cancelada</option>
          </select>
        </div>
      </div>
      <TableTasks showTasks={showTasks} />
    </div>
  );
};

export default Tasks;
