/* global gapi */

import React from 'react';
import { connect } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import EditableFormTable from './OrderList';
import { setAuthenticated, setError, googleApiLoaded, setUserProfile } from './action-creators/appActions';
import GoogleLogin from 'react-google-login';
import { Spin, Layout, Button, Row, Col } from 'antd';
const { Header, Footer, Content } = Layout;

const constructUserProfile = currentUser => {
  const user = currentUser.get();
  console.log(user.getBasicProfile())
  return {
    imageUrl: currentUser.get('imageUrl'),
    email: currentUser.get('email'),
    name: currentUser.get('givenName'),
    fullname: currentUser.get('givenName') + currentUser.get('familyName')
  }
}

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
      gapi.load('auth2', () => {
        console.log('loaded auth2')
        this.GoogleAuth = gapi.auth2.init({
          scope: 'profile email',
          client_id: '690572864489-l1ovcqtf1c0agf64idh65d3kgfkoafe8.apps.googleusercontent.com'
        });
        this.props.googleApiLoaded();
        this.GoogleAuth.isSignedIn.listen(this.onAuthStateChange);
      });
    }
    document.body.appendChild(script);
  }

  onAuthStateChange = (isAuthenticated) => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      const profile = JSON.parse(localStorage.getItem('profile'));
      this.props.setUserProfile(profile); 
    }
    this.props.setAuthenticated(isAuthenticated);
  }

  signOut = () => {
    localStorage.removeItem('profile');
    this.props.setAuthenticated(false);
    this.props.setUserProfile(null);
    this.GoogleAuth.signOut();
  }

  renderApp() {
    const { authenticated } = this.props.app;
    console.log(this.props.app)
    if (authenticated) {
      return (
        <Layout>
          <Header>
          <Row type="flex" justify="end">
              <Col>
                <Button ghost onClick={this.signOut}>Logout</Button>
              </Col>
            </Row>
          </Header>
          <Content>
            <EditableFormTable/>
          </Content>
          <Footer>
            <Row type="flex" justify="center">
              <Col>
                Utilize Demo App
              </Col>
            </Row>
          </Footer>
        </Layout>
      )
    }
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <GoogleLogin
          clientId="690572864489-l1ovcqtf1c0agf64idh65d3kgfkoafe8.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle => {
            localStorage.setItem('profile', JSON.stringify(responseGoogle.profileObj));
            this.props.setUserProfile(responseGoogle.profileObj);
          }}
          onFailure={(responseGoogle) => console.log(responseGoogle)}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    )
  }

  renderLoader() {
    return (
        <Spin style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}/>
    )
  }

  render() {
    const { googleApiLoaded } = this.props.app;
    return ( 
        <div style={{position: 'relative', width: '100v', height: '100vh'}}>
          { googleApiLoaded ? this.renderApp() : this.renderLoader() }
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    app: state
  }
}
const mapDispatchToProps = (dispatch) => ({
  googleApiLoaded: () => dispatch(googleApiLoaded()),
  setAuthenticated: (isAuthenticated) => dispatch(setAuthenticated(isAuthenticated)),
  setError: (error) => dispatch(setError(error)),
  setUserProfile: (userProfile) => dispatch(setUserProfile(userProfile))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
