import React from "react";
import Signup from "./auth/Signup.jsx";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Login from "./auth/Login.jsx";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <>

        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
            </Switch>
          </AuthProvider>
        </Router>
    </>
  );
}

export default App;
