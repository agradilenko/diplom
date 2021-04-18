import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteTask } from "../../../../actions/taskActions";

import Spinner from "../../../common/Spinner";
import Modal from "../Modal/Modal";

import "../MainContent.scss";
import "./Project.scss";
import { getTz } from "../../../../actions/tzActions";
import {deletePart, getPart, getParts} from "../../../../actions/partsActions";
import { getPartsByGost } from "../../../../actions/partsbygostActions";

class Project extends Component {
  state = {
    modal: false,
    edit: false,
    editTask: false,
    task: false,
    name: "",
    members: [],
    tzid: "",
    id: "",
    owner: {},
    tasks: [],
    parts: [],
    part: [],
    partbygostId: "",
    date: "",
    taskName: "",
    assignee: "",
    partName: "",
    taskId: "",
    dateDue: "",
    description: "",
    gost: "",
    tags: [],
  };

  toggleModal = (e) => {
    this.setState({
      modal: !this.state.modal,
      edit: false,
      task: false,
      editTask: false,
    });
  };

  toggleEditModal = (name, id, description, gost, tags, owner, e) => {
    this.setState({
      modal: !this.state.modal,
      edit: !this.state.edit,
      name: name,
      id: id,
      description: description,
      gost: gost,
      tags: tags,
      owner: owner,
    });
  };

  toggleTaskModal = (e) => {
    this.setState({
      modal: !this.state.modal,
      task: !this.state.task,
    });
  };

  toggleEditTaskModal = (partname, id, tzid, e) => {
    this.setState({
      modal: !this.state.modal,
      editTask: !this.state.editTask,
      partName: partname,
      partbygostId: id,
      tzid: tzid,
      // taskName: taskName,
      // assignee: assignee,
      // taskId: id,
      // dateDue: dateDue,
    });
  };

  componentDidMount() {
    // this.props.getProject(this.props.match.params.project);
    // this.props.getTasks(this.props.match.params.project);
    this.props.getTz(this.props.match.params.tz);
    this.props.getPartsByGost(this.props.match.params.gost);
    // this.props.getParts(this.props.match.params.tz);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.tz !== prevProps.match.params.tz) {
      this.props.getTz(this.props.match.params.tz);
      // this.props.getPartsByGost("60696da57244ac8e63f6a2cf")
    }
    // if(this.)
  }

  onChange = async (e) => {
    await this.setState({ tasks: this.props.tasks.tasks });

    let tasks = await [...this.state.tasks];

    tasks[e.target.id].taskName = await e.target.value;

    await this.setState({ tasks });
  };

  deleteTask = (id) => {
    this.props.deleteTask(id);
  };

  getCurrentPartContent = (partT) => {
    this.props.getPart(this.props.tzs.tz._id, partT.id)
    this.toggleEditTaskModal(
      partT.name,
      partT.id,
      this.props.tz._id
    )
  }

  render() {
    const { parts_by_gost } = this.props;
    const { tz } = this.props.tzs;

    // const

    let partsList = parts_by_gost.map((partTz, index) => (
      <div className="task-input" key={partTz.id}>
        <span
          onClick={this.getCurrentPartContent.bind(this, partTz)}
          // onClick={this.props.getPart.bind(this, tz._id, part.id)}
          id={index}
          name="task"
          className="project-task"
        >
          {partTz.name}
        </span>
      </div>
    ));

    if (
      this.props.tz &&
      !this.props.tzs.tzLoading
      // !this.props.parts.partsLoading
    ) {
      const { tz } = this.props;

      return (
        <div className="main-content">
          <h1 className="project-header">{tz.name}</h1>
          <button
            onClick={this.toggleEditModal.bind(
              this,
              tz.name,
              tz._id,
              tz.description,
              tz.gost,
              tz.tags,
              tz.owner
            )}
            className="main-btn center-btn"
          >
            Редактировать информацию о техническом задании
          </button>

          <div className="modal-wrapper test">
            <Modal
              onClose={this.toggleModal}
              modal={this.state.modal}
              edit={this.state.edit}
              task={this.state.task}
              editTask={this.state.editTask}
              partName={this.state.partName}
              gost={
                (this.state.gost = "60696d837244ac8e63f6a2ce"
                  ? "ГОСТ" + " 34.602-89"
                  : "ГОСТ-19.201-78")
              }
              part={this.state.part}
              partbygostId={this.state.partbygostId}
              selectedtags={this.state.tags}
              name={this.state.name}
              description={this.state.description}
              members={this.state.members}
              tzid={this.state.tzid}
              id={this.state.id}
              owner={this.state.owner}
              taskName={this.state.taskName}
              assignee={this.state.assignee}
              dateDue={this.state.dateDue}
              taskId={this.state.taskId}
              part={this.state.parts}
            />
          </div>
          <div className="tasks-container">
            <div className="projects-first-row">Содержание</div>
            <div className="project-tasks">{partsList}</div>
          </div>
        </div>
      );
    }
    return (
      <div className="project-spinner">
        <Spinner />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  project: state.projects.project,
  projects: state.projects,
  tasks: state.tasks,
  tz: state.tzs.tz,
  tzs: state.tzs,
  parts_by_gost: state.partsByGost.parts_by_gost,
  parts: state.parts,
});

export default connect(mapStateToProps, {
  deleteTask,
  getTz,
  getPart,
  getPartsByGost,
  getParts,
  deletePart,
})(Project);
