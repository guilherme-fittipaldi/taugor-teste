import React, { useState } from "react";
import firebase from "../../firebase";
import "firebase/storage";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";

function EditModal({ setEdit, editTask }) {
  const oldTask = editTask;
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(editTask.title);
  const [status, setStatus] = useState(editTask.status);
  const [description, setDescription] = useState(editTask.description);
  let changes = "";
  let alterations = null;
  if (editTask.editHistory) {
    alterations = editTask.editHistory.toString().split("|");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (oldTask.status !== status) {
      changes += ` Status mudou de: "${oldTask.status}" Para: "${status}".`;
    }
    if (oldTask.title !== title) {
      changes += ` Titulo mudou de: "${oldTask.title}" Para: "${title}".`;
    }
    if (oldTask.description !== description) {
      changes += ` Descrição mudou de: "${oldTask.description}" Para: "${description}".`;
    }
    if (idFile.files.length > 0) {
      const name = idFile.files[0].name;
      changes += ` Arquivo mudou de: "${oldTask.fileName}" Para: "${name}".`;
      try {
        var newFile = file;
        var storageRef = firebase.storage().ref(`files/` + name+ editTask.id.toString());
        var uploadTask = storageRef.put(newFile);
        uploadTask.on(
          "state_changed",
          function (snapshot) {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("upload is " + progress + " done");
          },
          function (error) {
            console.log(error.message);
          },
          function () {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                firebase
                  .firestore()
                  .collection("Task")
                  .doc(editTask.id)
                  .update({
                    title,
                    description,
                    status,
                    fileUrl: downloadURL,
                    fileName: name,
                    editHistory:
                      editTask.editHistory +
                      changes +
                      ` Em: ${moment()
                        .format("DD/MM/YYYY hh:mm:ss")
                        .toString()}|`,
                  });
              });
          }
        );
      } catch (err) {
        console.log(err.message);
      }

      setEdit(false);
      setError("");
    } else {
      if (changes !== "") {
        firebase
          .firestore()
          .collection("Task")
          .doc(editTask.id)
          .update({
            title,
            description,
            status,
            editHistory:
              editTask.editHistory +
              changes +
              ` Em: ${moment().format("DD/MM/YYYY hh:mm:ss").toString()}|`,
          });
        setEdit(false);
        setError("");
      } else {
        setError("Nenhuma alteração encontrada!");
      }
    }
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
        {alterations !== null && (
          <>
            <h4>Histórico de alterações</h4>
            <p style={{ overflowY: "scroll", height: "100px" }}>
              {alterations !== null &&
                alterations.map((alteration) => <tr>{alteration}</tr>)}
            </p>
          </>
        )}

        <div>
          <label>Titulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
          />
        </div>
        <div>
          <label>Descrição</label>
          <input
            id="decription"
            type="textarea"
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value);
            }}
            required
            style={{ resize: "none" }}
          />
        </div>
        <div>
          <label>Status:</label>
          {""}
          <select
            onChange={(event) =>
              setStatus(event.target.options[event.target.selectedIndex].text)
            }
            required
          >
            {editTask.status === "Pendente" ? (
              <option value="pendent" selected>
                Pendente
              </option>
            ) : (
              <option value="pendent">Pendente</option>
            )}
            {editTask.status === "Em andamento" ? (
              <option value="inProgress" selected>
                Em andamento
              </option>
            ) : (
              <option value="inProgress">Em andamento</option>
            )}
            {editTask.status === "Finalizada" ? (
              <option value="finalized" selected>
                Finalizada
              </option>
            ) : (
              <option value="finalized">Finalizada</option>
            )}
            {editTask.status === "Cancelada" ? (
              <option value="canceled" selected>
                Cancelada
              </option>
            ) : (
              <option value="canceled">Cancelada</option>
            )}
          </select>
        </div>
        <div>
          <label>Arquivo</label>
          <input
            id="idFile"
            type="file"
            onChange={(e) => setFile(e.currentTarget.files[0])}
            style={{ resize: "none" }}
          />
        </div>
        {error && <h3 style={{ color: "red" }}> {error} </h3>}
        <button>Salvar alterações</button>
      </form>
    </div>
  );
}

export default EditModal;
