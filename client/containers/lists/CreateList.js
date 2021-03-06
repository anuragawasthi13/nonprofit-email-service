import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import ImportCSV from './ImportCSV';

import { submitCSV, getLists } from '../../actions/listActions';
import { notify } from '../../actions/notificationActions';

function mapStateToProps(state) {
  // State reducer @ state.manageList
  return {
    lists: state.manageList.lists,
    isGetting: state.manageList.isGetting
  };
}

@connect(mapStateToProps, { submitCSV, notify, getLists })
export default class CreateList extends Component {

  static propTypes = {
    submitCSV: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    getLists: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.handleCSVSubmit = this.handleCSVSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.notification = this.notification.bind(this);
  }

  state = {
    title: this.generateDefaultTitle()
  }

  componentDidMount() {
    // Update lists only if we need to
    if (!this.props.lists.length) {
      this.props.getLists();
    }
  }

  notification(notification) {
    this.props.notify(notification);
  }

  handleCSVSubmit(file, headers) {
    const { title } = this.state;
    // List title should not be empty
    if (title === '') {
      this.props.notify({ message: 'Please provide a name for this list' });
    }
    else if (this.props.lists.some(x => x.name === title)) {
      // Notify if list name exists
      this.props.notify({ message: 'This list already exists, please provide a unique name' });
    }
    else {
      this.props.submitCSV(file, headers, title);
      this.setState({ title: this.generateDefaultTitle() });
      this.props.notify({
        message: 'Uploaded initiated - check notifications for progress',
        colour: 'green'
      });
      this.context.router.push(`/lists/manage`);
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  generateDefaultTitle() {
    return `List - ${moment().format('l, h:mm:ss')}`;
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>Create List
          </h1>
        </div>

        <section className="content">

          <Row>
            <Col xs={12} md={12}>

              <div className="box box-primary">
                <Row>
                  <Col md={12}>
                    <div className="box-header">
                      <h3 className="box-title">List name</h3>
                    </div>

                    <div className="box-body">

                      <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs pull-right">
                          {/*<li className="">
                            <a href="#tab_1-1" data-toggle="tab">Add single email</a>
                          </li>*/}
                          <li className="active">
                            <a href="#tab_3-2" data-toggle="tab">Import CSV</a>
                          </li>
                          <li className="pull-left header"><i className="fa fa-th"/>
                            Import a list</li>
                        </ul>


                        <form role="form">
                          <div className="form-group">
                            <input className="form-control" id="title" placeholder="The name of this list" type="text" value={this.state.title} onChange={this.handleChange} />
                          </div>
                        </form>
                        <ImportCSV handleCSVSubmit={this.handleCSVSubmit} notification={this.notification}/>
                      </div>

                    </div>
                </Col>
              </Row>

            {this.props.isGetting && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>

          </Col>
          </Row>
        </section>
      </div>
    );
  }
}
