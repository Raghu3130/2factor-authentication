import React from 'react';

export default class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      twofactor:{}
    }
  }

  setup() {
    fetch('/twofactor/setup', {method: "post"}).then( async response => {
      const result = await  response.json();
      if (response.status === 200) {
        console.log(result);
        this.setState({twofactor:result})
      }
    });
  }
  /** Verify the otp once to enable 2fa*/
  confirm(otp) {
    const body = {
      token: otp
    }
    fetch('/twofactor/verify', {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
      })
      .then(response => {
      const result = response.body;
      if (response.status === 200) {
        this.state.twofactor.secret = this.state.twofactor.tempSecret;
        this.state.twofactor.tempSecret = "";
      }
    })
      .catch(err => alert('invalid otp'));
  }
  /** disable 2fa */
  disable() {
    fetch('/twofactor/setup', {method: "delete"}).then(response => {
      const result = response.body;
      console.log(response);
      if (response.status === 200) {
        this
          .props
          .history
          .push('/');
      }
    }).catch(err => alert('error occured'));
  }
  created() {
    fetch('/twofactor/setup', {method: "post"})
      .then(response => {
      const result = response.body;
      if (response.status === 200 && !!result.secret) {
        this.state.twofactor = result
      }
    })
      .catch((err) => {
        if (err.status === 401) {
          this
            .props
            .history
            .push('/');
        }
      });
  }
  render() {
    return (
      <div>
        {this.state.twofactor.secret &&

        
        <div className="col-md-4 col-md-offset-4">
          <h3>Current Settings</h3>
          <img src={this.state.twofactor.dataURL} alt="..." className="img-thumbnail"/>
          <p>Secret - {this.state.twofactor.tempSecret}</p>
          <p>Type - TOTP</p>
        </div>
        }
        <div className="col-md-4 col-md-offset-4" v-if="!twofactor.secret">
          <h3>Setup Otp</h3>
          <div>
            <button onClick={() => this.setup()} className="btn btn-default">Enable</button>
          </div>
          { this.state.twofactor.tempSecret &&
          <span>
            <p>Scan the QR code or enter the secret in Google Authenticator</p>
            <img src={this.state.twofactor.dataURL} alt="..." className="img-thumbnail"/>
            <p>Secret - {this.state.twofactor.tempSecret}</p>
            <p>Type - TOTP</p>
          
              <div className="form-group">
                <label htmlFor="otp">Enter Otp:</label>
                <input onChange={(e) => this.setState({otp:e.target.value})} type="otp" className="form-control" id="otp"/>
              </div>
              <button onClick={() => this.confirm(this.state.otp)} className="btn btn-default">confirm</button>
          
          </span>
          }
        </div>
        <div className="col-md-1">
          <h3>Disable</h3>
            <button onClick={() => this.disable()} className="btn btn-danger">Disable</button>
          
        </div>
      </div>
    )
  }
}