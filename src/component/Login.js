import React from 'react';

export default class Login extends React.Component {
  constructor() {
    super();
    window.localStorage.email='demo@gmail.com';
    window.localStorage.password="test";
    this.state={
      email:window.localStorage.email,
      password:window.localStorage.password
    }
  }


  login(){
    window.localStorage.email = this.state.email;
    window.localStorage.password = this.state.password;
    fetch('http://localhost:4000/login',{
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({ email: this.state.email, password:this.state.password})})
    .then(response =>{
        if(response.status === 206){
            this.props.history.push('otp');
        } else if(response.status === 200) {
            localStorage.clear();
            localStorage.loggedin = true;
            this.props.history.push('/setup');
        }

        console.log("login", response)
    }).catch(err => {
        console.log("Invalid creds",err);
    });
}

  render() {
    return (
      <div className="col-md-4 col-md-offset-4">
                <div className="form-group">
            <label for="email">Email address:</label>
            <input value = {this.state.email} onChange={(e) =>this.setState({email:e.target.value})} type="email" className="form-control" id="email"/>
          </div>
          <div className="form-group">
            <label for="pwd">Password:</label>
            <input value ={this.state.password} onChange={(e) =>this.setState({password:e.target.value})} type="password" className="form-control" id="pwd"/>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox"/>
              Remember me</label>
          </div>
          <button onClick={() => this.login()} className="btn btn-default">Submit</button>
      
      </div>
    )
  }
}