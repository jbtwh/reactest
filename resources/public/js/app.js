let { Tab, Tabs, Popover, Tooltip, Button, Modal, OverlayTrigger, Form, FormGroup, ControlLabel, FormControl  } = ReactBootstrap;

class EmpAddModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      show: false,
      employee: null
    };
  }

   handleShow(employee) {
      this.setState({ show: true, employee: employee});
    }

    handleClose() {
      this.setState({ show: false, employee: null });
    }

  handleSave() {
  var self = this;
          $.ajax({
              url: (self.state.employee!=null ? "/update?id="+self.state.employee.id : "/create"),
              type: (self.state.employee!=null ? 'PUT' : 'POST'),
              contentType: "application/json",
              data: JSON.stringify({
              name:ReactDOM.findDOMNode(formInlineName).value,
              age:ReactDOM.findDOMNode(formInlineAge).value,
              years:ReactDOM.findDOMNode(formInlineYears).value,
              }),
              success: function(result) {
                  self.props.reload();
              },
              error: function(xhr, ajaxOptions, thrownError) {
               console.error(xhr.responseJSON.message);
              }
          });
      this.setState({ show: false });

  }

  render() {
    return (
      <div>
        <Button bsStyle="primary" bsSize="large" onClick={() => this.handleShow(null)}>
          Add employee
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
            <Form inline onSubmit={this.gotEmail}>
                <FormGroup controlId="formInlineName">
                  <ControlLabel>Name</ControlLabel>{' '}
                  <FormControl type="text" placeholder="Jane Doe" defaultValue={this.state.employee!=null ? this.state.employee.name : ""} />
                </FormGroup>{' '}
                <FormGroup controlId="formInlineAge">
                  <ControlLabel>Age</ControlLabel>{' '}
                  <FormControl type="number" placeholder="11" defaultValue={this.state.employee!=null ? this.state.employee.age : ""} />
                </FormGroup>{' '}
                <FormGroup controlId="formInlineYears">
                   <ControlLabel>Years</ControlLabel>{' '}
                   <FormControl type="number" placeholder="22" defaultValue={this.state.employee!=null ? this.state.employee.years : ""} />
                </FormGroup>{' '}
            </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSave}>Save</Button>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


var Employee = React.createClass({

  getInitialState: function() {
    return {display: true };
  },
  handleDelete() {
    var self = this;
    $.ajax({
        url: "/delete?id=" + self.props.employee.id,
        type: 'DELETE',
        success: function(result) {
          self.setState({display: false});
        },
        error: function(xhr, ajaxOptions, thrownError) {
          console.error(xhr.responseJSON.message);
        }
    });
  },
  handleUpdate() {
    this.props.modal(this.props.employee);
  },
  render: function() {

    if (this.state.display==false) return null;
    else return (
      <tr>
          <td>{this.props.employee.name}</td>
          <td>{this.props.employee.age}</td>
          <td>{this.props.employee.years}</td>
          <td>
            <button className="btn btn-info" onClick={this.handleDelete}>Delete</button>
          </td>
          <td>
             <button className="btn btn-info" onClick={this.handleUpdate}>Update</button>
          </td>
      </tr>
    );
  }
});

var EmployeeTable = React.createClass({

    test() {
      this.props.modal(null);
    },

  render: function() {
    var self = this;
    var rows = [];
    this.props.employees.forEach(function(employee) {
      rows.push(
        <Employee modal={self.props.modal} employee={employee} key={employee.id} />);
    });

    return (
      <div>
          <table className="table table-striped">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Years</th>
                      <th>Delete</th>
                      <th>Update</th>
                  </tr>
              </thead>
              <tbody>{rows}</tbody>
          </table>
      </div>
    );
  }
});

var App = React.createClass({

  loadEmployeesFromServer: function() {
    var self = this;
    $.ajax({
        url: "/employees",
      }).then(function(data) {
        self.setState({ employees: data });
      });
  },

  getInitialState: function() {
    return { employees: [] };
  },

  componentDidMount: function() {
    this.loadEmployeesFromServer();
  },

  showModal: function(data) {
    this.child.handleShow(data);
  },


  render() {
    return (
    <div>
     <EmpAddModal ref={instance => { this.child = instance; }}  reload={this.loadEmployeesFromServer}/>
      <EmployeeTable modal={this.showModal} employees={this.state.employees} />
    </div>
     );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));