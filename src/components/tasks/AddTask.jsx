import React, { useState } from "react";
import firebase from "../../firebase";
import "firebase/storage";
import { useAuth } from "../../contexts/AuthContext";

function AddTask({ setAddTask }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [file, setFile] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    var newFile = file;
    var storageRef = firebase.storage().ref("files/" + newFile.toString());
    var uploadTask = storageRef.put(newFile);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
      },
      function (error) {
        console.log(error.message);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          firebase
            .firestore()
            .collection("Task")
            .add({
              title,
              description,
              status,
              user: currentUser.email,
              fileUrl: downloadURL,
            })
            .then(() => {
              setTitle("");
              setDescription("");
              setStatus("Pendente");
              setFile(null);
            });
        });
      }
    );

    setAddTask(false);
  }
  return (
    <>
      <h2>Adicionar Atividade</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </div>
        <div>
          <label>Descrição</label>
          <input
            id="decription"
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
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
          >
            <option value="pendent">Pendente</option>
            <option value="inProgress">Em andamento</option>
            <option value="finalized">Finalizada</option>
            <option value="canceled">Cancelada</option>
          </select>
        </div>
        <div>
          <label>Arquivo</label>
          <input
            id="file"
            type="file"
            // value={file}
            onChange={(e) => setFile(e.currentTarget.files[0])}
            style={{ resize: "none" }}
          />
        </div>
        <button>Adicionar tarefa</button>
      </form>
    </>
  );
}

export default AddTask;
