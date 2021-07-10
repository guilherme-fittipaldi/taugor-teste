import React, { useState } from "react";
import firebase from "../../firebase";
import "firebase/storage";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";

function AddTask({ setAddTask }) {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const name = idFile.files[0].name;
    try {
      var newFile = file;
      var storageRef = firebase
        .storage()
        .ref("files/" + name + moment().toString());
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
                editHistory: "",
                fileName: "",
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
    } catch (err) {
      console.log(err.message);
    }

    setAddTask(false);
  }
  return (
    <>
      <br />
      <br />
      <br />
      <h2>Adicionar Atividade</h2>
      <form onSubmit={handleSubmit}>
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
            onChange={(e) => setDescription(e.currentTarget.value)}
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
            <option value="pendent">Pendente</option>
            <option value="inProgress">Em andamento</option>
            <option value="finalized">Finalizada</option>
            <option value="canceled">Cancelada</option>
          </select>
        </div>
        <div>
          <label>Arquivo</label>
          <input
            id="idFile"
            type="file"
            onChange={(e) => setFile(e.currentTarget.files[0])}
            style={{ resize: "none" }}
            required
          />
        </div>
        <button>Adicionar tarefa</button>
      </form>
    </>
  );
}

export default AddTask;
