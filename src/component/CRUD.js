import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import 'firebase/database';

export default class CRUD extends Component
{
    constructor(props){
        super(props);

        this.state = {
            firstname: '',
            lastname: '',
            phone: '',
            users: [],
            number: 0,
            oldId: 0,
            newId: 0
        }

        //this.Test();  
        //this.Func()
        this.getUsers();
    }

    async Func(){
        var newId = await this.getNewId();
        var firstname = this.state.firstname;
        var lastname = this.state.lastname;
        var phone = this.state.phone;
        console.log('New ID in Func : ', newId);
        this.setUser(newId,firstname, lastname, phone)
    }

    async setUser(newId, firstname, lastname, phone){
        await firebase.database().ref('users/' + newId).set({
            id: newId,
            firstname: firstname,
            lastname: lastname,
            phone: phone
        });
        console.log('Set user , New ID : ', newId)
    }

    getData(){
        return new Promise(resolve => {
            //var users = [];
            firebase.database().ref('users').on('value', snap => {
                //users = snap.val();
                resolve(snap.val());
            });
        });
    }

    async getNewId(){
        await this.getData().then(result => {
            //console.log(result);
            this.setState({
                oldId: result[result.length - 1].id
            });
            this.setState({
                newId: (this.state.oldId + 1)
            });
            console.log('New ID in getNewId : ', this.state.newId);
        });
        var newId = this.state.newId;
        return newId;
    }

    async submitData(){
        await this.Func();
        this.setState({
            firstname: '',
            lastname: '',
            phone: ''
        });
        await this.getUsers();
    }

    async getUsers(){
        var usersPromise = new Promise(r => {
            firebase.database().ref('users').on('value', snap =>{
                r(snap.val())
            });
        });

        await usersPromise.then(result => {
            this.setState({
                users: result
            });
        })

        var users = this.state.users;
        //console.log(users);
        var tableUsers = users.map( item => {
            return(
            <tr key={item.id.toString()}>
                <td>ID : {item.id}</td>
                <td>Firstname : {item.firstname}</td>
                <td>Lastname : {item.lastname}</td>
                <td>Phone : {item.phone}</td>
            </tr>)
        });

        return(
            ReactDOM.render(
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableUsers}
                    </tbody>
                </table>,
                document.getElementById('tableUsers')
            )

        );
    }

    render(){
        //console.log(firebase);
        return(
            <div className='row'>
                <div className='col-6'>
                    <div className='form-group'>
                        <div className='col-8'>
                            <label>Firstname</label>
                            <input className='form-control' value={this.state.firstname} onChange={ (t) => {
                                this.setState({
                                    firstname: t.target.value
                                });
                            }} />
                        </div>
                        <div className='col-8'>
                            <label>Lastname</label>
                            <input className='form-control' value={this.state.lastname} onChange={ (t) => {
                                this.setState({
                                    lastname: t.target.value
                                });
                            }} />
                        </div>
                        <div className='col-8'>
                            <label>Phone</label>
                            <input className='form-control' value={this.state.phone} onChange={ (t) => {
                                this.setState({
                                    phone: t.target.value
                                });
                            }} />
                        </div>
                        <div className='col-8'><br/>
                            <button className='btn btn-sm btn-info' onClick={() =>{
                                this.submitData();
                            }}>Submit</button>
                        </div>
                    </div>
                </div>
                <div className='col-6' id='tableUsers'>
                </div>
            </div>
        );
    }
}