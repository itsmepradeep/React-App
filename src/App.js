/* global gapi */

import React from "react";
import { connect } from "react-redux";
import GoogleLogin from "react-google-login";
import { Spin, Layout, Button, Row, Col, Avatar, message } from "antd";
import EditableFormTable from "./OrderList";
import {
  setAuthenticated,
  googleApiLoaded,
  setUserProfile
} from "./action-creators/appActions";
import SECRETS from "./secrets";

const { Header, Footer, Content } = Layout;

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.loadGoogleApis();
  }

  loadGoogleApis = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.onload = () => {
      gapi.load("auth2", () => {
        gapi.auth2
          .init({
            scope: "profile email",
            client_id: SECRETS.client_id
          })
          .then(GoogleAuth => {
            this.GoogleAuth = GoogleAuth;
            this.props.googleApiLoaded();
            this.onAuthStateChange(this.GoogleAuth.isSignedIn.get());
            this.GoogleAuth.isSignedIn.listen(this.onAuthStateChange);
          });
      });
    };
    document.body.appendChild(script);
  };

  onAuthStateChange = isAuthenticated => {
    if (isAuthenticated) {
      // get user info stored in the localstorage
      const profile = JSON.parse(localStorage.getItem("profile"));
      this.props.setUserProfile(profile);
    }
    this.props.setAuthenticated(isAuthenticated);
  };

  signOut = () => {
    // clear data
    localStorage.removeItem("profile");
    this.props.setAuthenticated(false);
    this.props.setUserProfile(null);
    this.GoogleAuth.signOut();
  };

  handleError(error) {
    switch (error) {
      case "popup_closed_by_user":
        message.error("Popup has been closed. Please try again!");
        break;
      default:
        message.error(error);
    }
  }

  renderApp() {
    const { authenticated, userProfile } = this.props.app;
    if (authenticated) {
      return (
        <Layout>
          <Header>
            <Row type="flex" justify="space-between">
              <Col>
                <p style={{ color: "white" }}>{userProfile.name}</p>
              </Col>
              <Col>
                <Button ghost onClick={this.signOut}>
                  Logout
                </Button>
              </Col>
            </Row>
          </Header>
          <Content>
            <EditableFormTable />
          </Content>
          <Footer>
            <Row type="flex" justify="center">
              <Col>Utilize Demo App</Col>
            </Row>
          </Footer>
        </Layout>
      );
    }
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <GoogleLogin
          clientId={SECRETS.client_id}
          onSuccess={responseGoogle => {
            localStorage.setItem(
              "profile",
              JSON.stringify(responseGoogle.profileObj)
            );
            this.props.setUserProfile(responseGoogle.profileObj);
          }}
          onFailure={error => {
            this.handleError(error.error);
          }}
          cookiePolicy={"single_host_origin"}
          buttonText={"Login with your Google Account"}
        />
      </div>
    );
  }

  renderLoader() {
    return (
      <Spin
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      />
    );
  }

  render() {
    const { googleApiLoaded } = this.props.app;
    return (
      <div style={{ position: "relative", width: "100v", height: "100vh" }}>
        {googleApiLoaded ? this.renderApp() : this.renderLoader()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    app: state
  };
};

const mapDispatchToProps = dispatch => ({
  googleApiLoaded: () => dispatch(googleApiLoaded()),
  setAuthenticated: isAuthenticated =>
    dispatch(setAuthenticated(isAuthenticated)),
  setUserProfile: userProfile => dispatch(setUserProfile(userProfile))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
