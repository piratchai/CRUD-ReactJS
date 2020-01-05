import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import 'firebase/database';

export default class Users extends Component
{
    state = {
        tableUsers: [],
        //-------------
        id: 0,
        firstname: '',
        lastname: '',
        phone: '',
        //---------
        oldId: 0,
        newId: 0,
        //--------
        isEdited: false,
        //-------
        btnValue: 'Submit',
        //-------
        pressBtnCancel: false
    }

    async componentDidMount(){
        await this.getData();
    }

    async SubmitData(){
        var firstname = this.state.firstname;
        var lastname = this.state.lastname;
        var phone = this.state.phone;
        var id = this.state.id;
        var newId = await this.getNewId();

        if(this.state.isEdited != true){ //It's save
            firebase.database().ref('users/' + newId).set({
                id: newId,
                firstname: firstname,
                lastname: lastname,
                phone: phone
            });
        }
        else{ //It's update or edited
            firebase.database().ref('users/' + id).set({
                id: id,
                firstname: firstname,
                lastname: lastname,
                phone: phone
            });
        }

        this.clearState();
        
        await this.getData();

    }

    clearState(){
        this.setState({
            firstname: '',
            lastname: '',
            phone: '',
            btnValue: 'Submit',
            isEdited: false,
            pressBtnCancel: false
        });
    }



    async getNewId(){
        var usersPromise = new Promise(r => {
            firebase.database().ref('users').on('value', snap => {
                r(snap.val());
            })
        })

        await usersPromise.then(r => {
            this.setState({
                oldId: r[r.length - 1].id
            });
        })

        var newId = (this.state.oldId + 1)

        return newId;
    }

    async getData(){
        var usersPromise = new Promise(r => {
            firebase.database().ref('users').on('value', snap => {
                r(snap.val());
            })
        });

        await usersPromise.then(r => {
            this.setState({
                tableUsers: r
            });
        })

        var users = this.state.tableUsers;
        console.log(users);
        var listUsers = users.map(item => {
            return(
                <tr key={item.id.toString()} onClick={() => {
                    this.editUser(item.id, item.firstname, item.lastname, item.phone)
                }}>
                    <td>{item.id}</td>
                    <td>{item.firstname}</td>
                    <td>{item.lastname}</td>
                    <td>{item.phone}</td>
                </tr>
            )
        })

        ReactDOM.render(
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>รหัส</th>
                        <th>ชื่อ</th>
                        <th>นามสกุล</th>
                        <th>เบอร์</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers}
                </tbody>
            </table>,
            document.getElementById('tblUsers')
        );
    }


    editUser(id, firstname, lastname, phone){
        this.setState({
            id: id,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            isEdited: true,
            btnValue: 'Update',
            pressBtnCancel: true
        });
    }

    render(){
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
                                this.SubmitData();
                            }}>{this.state.btnValue}</button>
                            &emsp;
                            <button className='btn btn-sm btn-default' onClick={() =>{
                                                            this.clearState();
                                                        }}
                                                        disabled={this.state.pressBtnCancel ? false: true}>ยกเลิก</button>
                        </div>
                    </div>
                </div>
                <div className='col-6' id='tblUsers'>
                    
                </div>
            </div>
        );
    }
}