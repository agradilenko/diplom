import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "antd/dist/antd.css";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../../../../actions/projectsActions";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../../../../actions/taskActions";

import moment from "moment";

import "./Modal.scss";
import { createTz } from "../../../../actions/tzActions";
import { getGosts } from "../../../../actions/gostActions";
import { createTag, getTags } from "../../../../actions/tagsActions";

class Modal extends Component {
  state = {
    projectName: "",
    tzName: "",
    tzDescription: "",
    tzGost: "",
    tzTags: [],
    members: [{ name: "", email: "" }],
    taskName: "",
    assignee: "",
    monthDue: "",
    dayDue: "",
    taskId: "",
    editorState: EditorState.createEmpty(),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.edit) {
      this.setState({
        projectName: nextProps.name,
        members: nextProps.members,
      });
    } else if (nextProps.editTask) {
      this.setState({
        taskName: nextProps.taskName,
      });
    }
  }

  componentDidMount() {
    this.props.getGosts();
    this.props.getTags();
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleTagsChange = (newValue) => {
    const tagsIds = [...new Set(newValue.map((item) => item.value))];
    this.setState({ tzTags: tagsIds });
  };

  addMember = (e) => {
    this.setState((prevState) => ({
      members: [...prevState.members, { name: "", email: "" }],
    }));
  };

  deleteMember = (index) => {
    let array = [...this.state.members];
    array.splice(index, 1);
    this.setState({ members: array });
  };

  createTz = () => {
    let tz = {
      name: this.state.tzName,
      description: this.state.tzDescription,
      gost: this.state.tzGost,
      tags: this.state.tzTags,
    };
    this.props.createTz(tz);
    this.onClose();
  };

  updateProject = async (id) => {
    let project = {
      id: this.props.id,
      projectName: this.state.projectName,
      members: this.state.members,
    };

    await this.props.updateProject(project);

    this.onClose();
    window.location.reload();
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  deleteProject = (id) => {
    this.props.deleteProject(id, this.props.history);
    this.onClose();
  };

  deleteTask = (id) => {
    this.props.deleteTask(id);
    this.onClose();
  };

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      tzName: "",
      tzDescription: "",
      tzGost: "",
      tzTgs: "",
    });
  };

  onSelectChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createTask = (e) => {
    e.preventDefault();

    let fullDate =
      this.state.monthDue +
      "-" +
      this.state.dayDue +
      "-" +
      Date().split(" ")[3];

    let momentDate = moment(fullDate, "MM-DD-YYYY")._d.toString().split(" ");

    let finalDate = momentDate[1] + " " + momentDate[2];

    const data = {
      project: this.props.projects.project._id,
      taskName: this.state.taskName,
      assignee: this.state.assignee,
      dateDue: finalDate,
    };

    this.props.createTask(data);

    this.onClose();
  };

  updateTask = (id) => {
    let finalDate;

    let dates = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (!this.state.monthDue && !this.state.dayDue) {
      finalDate = this.props.dateDue;
    } else if (
      this.props.dateDue &&
      this.props.dateDue !== "Date undefined" &&
      !this.state.monthDue &&
      this.state.dayDue
    ) {
      let fullDate =
        dates.indexOf(this.props.dateDue.split(" ")[0]) +
        1 +
        "-" +
        this.state.dayDue +
        "-" +
        Date().split(" ")[3];

      let momentDate = moment(fullDate, "MM-DD-YYYY")._d.toString().split(" ");

      finalDate = momentDate[1] + " " + momentDate[2];
    } else if (
      this.props.dateDue &&
      this.props.dateDue !== "Date undefined" &&
      !this.state.dayDue &&
      this.state.monthDue
    ) {
      let fullDate =
        this.state.monthDue +
        "-" +
        this.props.dateDue.split(" ")[1] +
        "-" +
        Date().split(" ")[3];

      let momentDate = moment(fullDate, "MM-DD-YYYY")._d.toString().split(" ");

      finalDate = momentDate[1] + " " + momentDate[2];
    } else {
      let fullDate =
        this.state.monthDue +
        "-" +
        this.state.dayDue +
        "-" +
        Date().split(" ")[3];

      let momentDate = moment(fullDate, "MM-DD-YYYY")._d.toString().split(" ");

      finalDate = momentDate[1] + " " + momentDate[2];
    }

    let task = {
      id: id,
      taskName: this.state.taskName,
      dateDue: finalDate,
      assignee: this.state.assignee || this.props.assignee,
    };

    this.props.updateTask(task);

    this.onClose();
  };

  render() {
    const { editorState } = this.state;
    const { tags } = this.props;
    const { gosts } = this.props.gosts;
    const options = [
      { value: "60696d837244ac8e63f6a2ce", label: "ГОСТ 34.602-89" },
      { value: "60696da57244ac8e63f6a2cf", label: "ГОСТ-19.201-78" },
    ];
    console.log(gosts);
    console.log(tags);
    if (!this.props.modal) {
      return null;
    }

    document.onkeyup = (e) => {
      if (e.keyCode === 27 && this.props.modal) {
        this.onClose();
      }
    };

    let { members } = this.state;

    // Create task modal
    if (this.props.task) {
      const { teamMembers } = this.props.projects.project;
      const { name, email } = this.props.auth.user;

      // Assignee dropdown in Modal
      let membersOptions = teamMembers.map((member, index) => (
        <option key={index} value={member.email}>
          {member.name}
        </option>
      ));

      // Due date dropdown in Modal
      const MONTHS = new Array(12).fill(1);
      const DAYS = new Array(31).fill(1);

      let monthsOptions = MONTHS.map((month, i) => (
        <option key={i} value={i + 1}>
          {i < 9 && "0"}
          {i + 1}
        </option>
      ));

      let daysOptions = DAYS.map((day, i) => (
        <option key={i} value={i + 1}>
          {i < 9 && "0"}
          {i + 1}
        </option>
      ));

      return (
        <form onSubmit={this.createTask} className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Create task</h1>
          <div className="form-group">
            <label>
              <div className="form-label">Task Name (required)</div>
              <input
                required
                onChange={this.onChange}
                value={this.state.taskName}
                id="taskName"
                type="text"
                placeholder={"What is the task?"}
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group">
            <div className="split">
              <label>
                <div className="form-label">Assignee</div>
                <select
                  onChange={this.onSelectChange}
                  value={this.state.assignee}
                  id="assignee"
                  type="text"
                  className="form-input task-input-split"
                >
                  <option disabled value="">
                    Assign to
                  </option>
                  <option value={email}>{name + " (You)"}</option>
                  {membersOptions}
                </select>
              </label>
              <label>
                <div className="form-label">Due Date</div>
                <div className="split">
                  <select
                    required={this.state.dayDue ? true : false}
                    onChange={this.onSelectChange}
                    value={this.state.monthDue}
                    id="monthDue"
                    type="text"
                    className="form-input task-input-split month-due"
                  >
                    <option disabled value="">
                      Month
                    </option>
                    {monthsOptions}
                  </select>
                  <select
                    required={this.state.monthDue ? true : false}
                    onChange={this.onSelectChange}
                    value={this.state.dayDue}
                    id="dayDue"
                    type="text"
                    className="form-input task-input-split"
                  >
                    <option disabled value="">
                      Day
                    </option>
                    {daysOptions}
                  </select>
                </div>
              </label>
            </div>
          </div>
          <div>
            <button className="main-btn update-project" type="submit">
              Create Task
            </button>
          </div>
        </form>
      );
    }

    // Edit Task Modal
    else if (this.props.editTask) {
      const { teamMembers } = this.props.projects.project;
      const { name, email } = this.props.auth.user;

      const { assignee, dateDue, taskId } = this.props;
      let assigneeName;

      let assignedMonth = moment(dateDue).month() + 1;
      let assignedDay = dateDue.split(" ")[1];

      // Find name from email
      teamMembers.forEach((member) => {
        if (member.email === assignee) {
          assigneeName = member.name;
        } else if (assignee) {
          assigneeName = name + " (You)";
        }
      });

      // Assignee dropdown in Modal
      let membersOptions = teamMembers.map((member, index) => {
        if (member.name !== assigneeName) {
          return (
            <option key={member._id} value={member.email}>
              {member.name}
            </option>
          );
        }
        return null;
      });

      // Due date dropdown in Modal
      const MONTHS = new Array(12).fill(1);
      const DAYS = new Array(31).fill(1);

      let monthsOptions = MONTHS.map((month, i) => {
        return (
          <option key={i} value={i + 1}>
            {i < 9 && "0"}
            {i + 1}
          </option>
        );
      });

      let daysOptions = DAYS.map((day, i) => (
        <option key={i} value={i + 1}>
          {i < 9 && "0"}
          {i + 1}
        </option>
      ));

      return (
        <form className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Edit task</h1>
          <div className="form-group">
            <label>
              <div className="form-label">Task Name (required)</div>
              <input
                required
                onChange={this.onChange}
                value={this.state.taskName}
                id="taskName"
                type="text"
                placeholder={"What is the task?"}
                className="form-input"
              />
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
              />
            </label>
          </div>
          <div className="form-group">
            <div className="split">
              <label>
                <div className="form-label">Assignee</div>
                <select
                  onChange={this.onSelectChange}
                  value={this.state.assignee}
                  id="assignee"
                  type="text"
                  className="form-input task-input-split"
                >
                  {!assignee && (
                    <option disabled value="">
                      Assign to
                    </option>
                  )}
                  {assignee && <option value={assignee}>{assigneeName}</option>}
                  {assigneeName !== name + " (You)" && (
                    <option value={email}>{name + " (You)"}</option>
                  )}
                  {membersOptions}
                </select>
              </label>
              <label>
                <div className="form-label">Due Date</div>
                <div className="split">
                  <select
                    required={this.state.dayDue ? true : false}
                    onChange={this.onSelectChange}
                    value={
                      this.state.monthDue || parseInt(assignedMonth).toString()
                    }
                    id="monthDue"
                    type="text"
                    className="form-input task-input-split month-due"
                  >
                    {!dateDue && (
                      <option disabled value="">
                        Month
                      </option>
                    )}
                    {monthsOptions}
                  </select>
                  <select
                    required={this.state.monthDue ? true : false}
                    onChange={this.onSelectChange}
                    value={
                      this.state.dayDue || parseInt(assignedDay).toString()
                    }
                    id="dayDue"
                    type="text"
                    className="form-input task-input-split"
                  >
                    {!dateDue && (
                      <option disabled value="">
                        Day
                      </option>
                    )}
                    {daysOptions}
                  </select>
                </div>
              </label>
            </div>
          </div>
          <div>
            <button
              className="main-btn update-project"
              type="button"
              onClick={this.updateTask.bind(this, taskId)}
            >
              Update Task
            </button>
            <button
              className="main-btn delete-project"
              onClick={this.deleteTask.bind(this, taskId)}
            >
              Delete Task
            </button>
          </div>
        </form>
      );
    }

    // Edit project modal
    else if (this.props.edit) {
      return (
        <div className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Edit Project Info</h1>
          <p className="created-by">
            Created by {this.props.owner.name} ({this.props.owner.email})
          </p>
          <div className="form-group">
            <label>
              <div className="form-label">Project Name (required)</div>
              <input
                onChange={this.onChange}
                value={this.state.projectName}
                id="projectName"
                type="text"
                placeholder={"My Awesome Project"}
                className="form-input"
              />
            </label>
          </div>
          <div className="form-label">Add team members (optional)</div>
          <button className="main-btn add-members" onClick={this.addMember}>
            Add another member
          </button>
          <div className="members-edit">
            {members.map((val, id) => {
              let memberId = `member-${id}`,
                emailId = `email-${id}`;
              return (
                <div className="split" key={id}>
                  <label className="form-label" htmlFor={memberId}>
                    Name (required for teams)
                    <input
                      type="text"
                      name="name"
                      data-id={id}
                      id={memberId}
                      value={members[id].name}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <label className="form-label split-email" htmlFor={emailId}>
                    Email (required for teams)
                    <input
                      type="text"
                      name="email"
                      data-id={id}
                      id={emailId}
                      value={members[id].email}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <span
                    className="delete"
                    onClick={this.deleteMember.bind(this, id)}
                  >
                    REMOVE
                  </span>
                </div>
              );
            })}
          </div>
          <div>
            <button
              className="main-btn update-project"
              onClick={this.updateProject.bind(this, this.props.id)}
            >
              Update Project
            </button>
            {this.props.owner.id === this.props.auth.user.id ? (
              <button
                className="main-btn delete-project"
                onClick={this.deleteProject.bind(this, this.props.id)}
              >
                Delete Project
              </button>
            ) : null}
          </div>
        </div>
      );
    }

    // Create project modal
    else
      return (
        <div className="modal" style={{ minHeight: "700px" }}>
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Создайте техническое задание</h1>
          <div className="form-group">
            <label>
              <div className="form-label">Название технического задания</div>
              <input
                onChange={this.onChange}
                value={this.state.tzName}
                id="tzName"
                type="text"
                placeholder="My Awesome Project"
                className="form-input"
              />
              <div className="form-label">Краткое описание</div>
              <textarea
                onChange={this.onChange}
                value={this.state.tzDescription}
                id="tzDescription"
                placeholder="Введите краткое описание создаваемого технического задания"
                className="form-input"
                style={{ minHeight: "100px" }}
              />
              <div className="form-label"> </div>
              Выберите Государственный стандарт, по которому будет
              проектироваться ТЗ
              <div>
                <Select
                  onChange={(value) => this.setState({ tzGost: value.value })}
                  options={options}
                />
              </div>
              <div>
                <div className="form-label">Теги технического задания</div>
                <CreatableSelect
                  onChange={this.handleTagsChange}
                  isMulti
                  options={tags}
                />
              </div>
            </label>
          </div>
          <div>
            <button className="main-btn create-project" onClick={this.createTz}>
              Создать техническое задание
            </button>
          </div>
        </div>
      );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  projects: state.projects,
  tasks: state.tasks,
  tzs: state.tzs,
  gosts: state.gosts,
  tags: state.tags,
});

export default connect(mapStateToProps, {
  createTz,
  getGosts,
  createTag,
  getTags,
  createProject,
  updateProject,
  deleteProject,
  createTask,
  deleteTask,
  updateTask,
})(withRouter(Modal));
