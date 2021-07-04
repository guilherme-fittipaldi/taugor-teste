import React, { useState } from "react";
import firebase from "../../firebase";
import CloseIcon from "@material-ui/icons/Close";
import { useAuth } from "../../contexts/AuthContext";

function EditModal({ setEdit, edit, editTask }) {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("Pendente");
  function handleSubmit(e) {
    e.preventDefault();

    firebase
      .firestore()
      .collection("Task").doc(editTask.id)
      .update({
        status,
        user: currentUser.email,
      })
      setEdit(false)
  }

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="form-modal">
        <h2 style={{ width: "100%" }}>
          Editar tarefa{" "}
          <strong onClick={() => setEdit(false)}>
            <i class="fas fa-times"></i>
          </strong>
        </h2>

        <hr />
        <div>
          <h4>{editTask.title}</h4>
          <p>
            Descrição: {editTask.description}
            <br />
            <sub> {editTask.user ? `Por: ${editTask.user}` : null}</sub>
          </p>
        </div>
        <div>
          <label>Status:</label>
          {""}
          <select
            onChange={(event) =>
              setStatus(event.target.options[event.target.selectedIndex].text)
            }
          >
            <option value="Pendente">Pendente</option>
            <option value="Andamento">Em andamento</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <button>Adicionar tarefa</button>
      </form>
    </div>
  );
}

export default EditModal;
