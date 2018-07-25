import React from 'react';

export default class Otp extends React.Component {
  constructor(props) {
    super(props)
  }
  login(otp) {
    if (otp) {
      
      const payload = {
        email: window.localStorage.email,
        password: window.localStorage.password
      }
      const options = {
        headers: {
          ['x-otp']: otp,
          'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method:"post",
        body:JSON.stringify(payload)
      }
      fetch('/login', options)
        .then(async (response) => {
          // let result = await response.json();
          // console.log(result);
          if (response.status === 200) {
            window.localStorage.clear();
            window.localStorage.loggedin = true;
            this.props.history.push('/setup');
          }
        })
        .catch(err => {
          console.log("Invalid creds",err);
        });
    }
  }
  render() {
    return (
      <div className="col-md-4 col-md-offset-4">
      
          <div className="form-group">
            <label htmlFor="otp">Enter Otp:</label>
            <input
              onChange={(e) => this.setState({otp: e.target.value})}
              type="otp"
              className="form-control"
              id="otp"/>
          </div>
          <button onClick={() => this.login(this.state.otp)} className="btn btn-default">Submit</button>
        
      </div>
    )
  }
}