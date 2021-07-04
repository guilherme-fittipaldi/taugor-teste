import React, { useState } from "react";
import firebase from "../../firebase";
import CloseIcon from "@material-ui/icons/Close";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";

function EditModal({ setEdit, edit, editTask }) {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("Pendente");
  const oldStatus = editTask.status;
  let alterations = null;
  let reverso = null;
  if (editTask.editHistory) {
    alterations = editTask.editHistory.toString().split("|");
    console.log(alterations);
    // reverso = alterations.reverse();
    // console.log(reverso);
  }

  function handleSubmit(e) {
    e.preventDefault();
    firebase
      .firestore()
      .collection("Task")
      .doc(editTask.id)
      .update({
        status,
        editHistory:
          editTask.editHistory +
          `|De: ${oldStatus} Para: ${status} Em: ${moment()
            .format("DD/MM/YYYY hh:mm:ss")
            .toString()}`,
      });
    setEdit(false);
  }

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="form-modal">
        <h2 style={{ width: "100%" }}>
          Editar tarefa: {editTask.title}
          <strong onClick={() => setEdit(false)}>
            <CloseIcon />
          </strong>
        </h2>
        <hr />
        <p>Descrição: {editTask.description}</p>

          {alterations !== null && <h4>Histórico de alterações</h4>}
        <p style={{ overflowY: "scroll", height: "100px" }}>
          {alterations !== null &&
            alterations.map((alteration) => <tr>{alteration}</tr>)}
        </p>

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
        <button>Editar tarefa</button>
      </form>
    </div>
  );
}

export default EditModal;
