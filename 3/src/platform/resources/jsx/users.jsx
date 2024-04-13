import React from 'react';
import axios from 'axios';
import moment from 'moment';

import Util from 'js/util';

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: props.users
        };
    }

    search = (e) => {
        let users = this.props.users.filter((user) =>
            user.display_name.toLowerCase().includes(e.target.value.toLowerCase())
        );

        this.setState({
            users
        });
    };

    update_user = async (e, user_id, update_body) => {
        e.preventDefault();
        const res = await axios.put(`/admin/users/${user_id}`, update_body);
        if (res.status >= 400) {
            bootbox.alert('An error has occurred');
        } else {
            location = location;
        }
    };

    render() {
        return (
            <div>
                <input class="form-control" type="text" placeholder="Search" onChange={this.search} />
                <table class="table table-sm table-dark">
                    <tbody>
                        <tr>
                            <th style={{ width: '600px' }}></th>
                            <th style={{ width: '100px' }}>User ID</th>
                            <th>Username</th>
                            <th>Display Name</th>
                            <th>Registered</th>
                        </tr>
                        {this.state.users.map((user) => {
                            return (
                                <tr key={user.user_id}>
                                    <td>
                                        <a href={'/admin/users/login_as?user_id=' + user.user_id}>login as</a> |{' '}
                                        <a
                                            href="#"
                                            class="pointer"
                                            onClick={(e) =>
                                                this.update_user(e, user.user_id, {
                                                    is_contest_author: user.is_contest_author ? 0 : 1
                                                })
                                            }
                                        >
                                            {user.is_contest_author ? 'unset contest author' : 'set contest author'}
                                        </a>{' '}
                                        |{' '}
                                        <a
                                            href="#"
                                            class="pointer"
                                            onClick={(e) =>
                                                this.update_user(e, user.user_id, {
                                                    is_challenge_author: user.is_challenge_author ? 0 : 1
                                                })
                                            }
                                        >
                                            {user.is_challenge_author
                                                ? 'unset challenge author'
                                                : 'set challenge author'}
                                        </a>{' '}
                                        |{' '}
                                        <a
                                            href="#"
                                            class="pointer"
                                            onClick={(e) =>
                                                this.update_user(e, user.user_id, {
                                                    is_superuser: user.is_superuser ? 0 : 1
                                                })
                                            }
                                        >
                                            {user.is_superuser ? 'unset superuser' : 'set superuser'}
                                        </a>
                                    </td>
                                    <td>{user.user_id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.display_name}</td>
                                    <td>{moment(user.created_at).format('MMMM Do, YYYY')}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

Util.try_render('react_users', Users);

export default Users;
