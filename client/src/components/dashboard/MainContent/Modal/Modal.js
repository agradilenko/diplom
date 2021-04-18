import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
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
import { createTz, deleteTz, updateTz } from "../../../../actions/tzActions";
import { getGosts } from "../../../../actions/gostActions";
import { createTag, getTags } from "../../../../actions/tagsActions";
import {
  createPart,
  getPart,
  updatePart
} from "../../../../actions/partsActions";
import Spinner from "../../../common/Spinner";

class Modal extends Component {
  state = {
    projectName: "",
    tzName: "",
    tzDescription: "",
    tzGost: "",
    tzTags: [],
    members: [{ name: "", email: "" }],
    taskName: "",
    partName: "",
    tzid: "",
    part: "",
    partbygostId: "",
    assignee: "",
    monthDue: "",
    dayDue: "",
    taskId: "",
    rating: "",
    number_of_uses: "",
    editorState: EditorState.createEmpty(),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.edit) {
      this.setState({
        tzName: nextProps.name,
        tzDescription: nextProps.description,
        tzGost: nextProps.gost,
        tzTags: nextProps.selectedtags,
      });
    } else if (nextProps.editTask) {
      this.setState(
        {
          partName: nextProps.partName,
          tzid: nextProps.tzid,
          partbygostId: nextProps.partbygostId,
        }
      );
    }
    if (nextProps.part && nextProps.part.length !==0) {
      console.log(nextProps.part)
      this.setState(
        {
          editorState: EditorState.createWithContent(
            convertFromRaw(JSON.parse(nextProps.part[0].content))
          )
        }
      )
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

  updateTz = async (id) => {
    let tz = {
      id: this.props.id,
      name: this.state.tzName,
      description: this.state.tzDescription,
      gost: (this.state.tzGost = "ГОСТ 34.602-89"
        ? "60696d837244ac8e63f6a2ce"
        : "60696da57244ac8e63f6a2cf"),
      tags: this.state.tzTags,
    };

    await this.props.updateTz(tz);

    this.onClose();
    // window.location.reload();
  };

  onEditorStateChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    console.log('content state', convertToRaw(contentState));
    this.setState({
      editorState,
    });
  };

  deleteTz = (id) => {
    this.props.deleteTz(id, this.props.history);
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
      editorState: "",
    });
  };

  onSelectChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createPart = (e) => {
    e.preventDefault();

    const contentState = this.state.editorState.getCurrentContent();
    let rawdata = JSON.stringify(convertToRaw(contentState));

    const data = {
      tz: this.props.tzs.tz._id,
      tz_by_gost: this.props.partbygostId,
      content: rawdata,
      rating: this.state.rating,
      number_of_uses: this.state.number_of_uses,
    };
    this.props.createPart(data);
  };

  updatePart = async (id) => {
    const contentState = this.state.editorState.getCurrentContent();
    let rawdata = JSON.stringify(convertToRaw(contentState));

    const data = {
      id: this.props.part[0]._id,
      tz: this.props.tzs.tz._id,
      tz_by_gost: this.props.partbygostId,
      content: rawdata,
      rating: this.state.rating,
      number_of_uses: this.state.number_of_uses,
    };

    await this.props.updatePart(data);

    this.onClose();
    // window.location.reload();
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
    // const { part } = this.props.parts;
    const options = [
      { value: "60696d837244ac8e63f6a2ce", label: "ГОСТ 34.602-89" },
      { value: "60696da57244ac8e63f6a2cf", label: "ГОСТ-19.201-78" },
    ];
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

    // Create / Edit Part Modal
    if (this.props.editTask && this.props.parts.partLoading === true)
      return <Spinner />;
    else if (this.props.editTask && this.props.parts.partLoading === false) {
      let part = this.props.part;
      let content;
      if (part.length === 0) {
        content = "";
        const { name, email } = this.props.auth.user;
        return (
          <form className="modal" style={{ height: "750px" }}>
            <span className="close-modal" onClick={this.onClose}>
              &times;
            </span>
            <h1 className="header">{this.state.partName}</h1>
            <div className="form-group">
              <label>
                <Editor
                  editorState={editorState}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={this.onEditorStateChange}
                />
              </label>
            </div>
            <div>
              <button
                className="main-btn update-project"
                type="button"
                onClick={this.createPart}
              >
                Сохранить информацию
              </button>
              <button
                className="main-btn delete-project"
                // onClick={this.deleteTask.bind(this, taskId)}
              >
                Очистить поле ввода
              </button>
            </div>
          </form>
        );
      } else {
        content = part[0].content;
        console.log(content)
        const { name, email } = this.props.auth.user;
        return (
          <form className="modal" style={{ height: "750px" }}>
            <span className="close-modal" onClick={this.onClose}>
              &times;
            </span>
            <h1 className="header">{this.state.partName}</h1>
            <div className="form-group">
              <label>
                <Editor
                  // editorState={EditorState.createWithContent(
                  //   convertFromRaw(JSON.parse(content))
                  // )}
                  editorState={editorState}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={this.onEditorStateChange}
                />
              </label>
            </div>
            <div>
              <button
                className="main-btn update-project"
                type="button"
                onClick={this.updatePart}
              >
                Сохранить информацию
              </button>
              <button
                className="main-btn delete-project"
                // onClick={this.deleteTask.bind(this, taskId)}
              >
                Очистить поле ввода
              </button>
            </div>
          </form>
        );
      }
    }

    // Edit tz info modal
    else if (this.props.edit) {
      return (
        <div className="modal" style={{ height: "700px" }}>
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">
            Редактировать информацию о техническом задании
          </h1>
          <p className="created-by">
            Создано: {this.props.owner.name} ({this.props.owner.email})
          </p>
          <div className="form-group">
            <div className="form-label">Название технического задания</div>
            <input
              onChange={this.onChange}
              value={this.state.tzName}
              id="tzName"
              type="text"
              placeholder={"Техническое задание..."}
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
            <div className="form-label">ГОСТ</div>
            <input
              disabled
              onChange={this.onChange}
              value={this.state.tzGost}
              id="tzName"
              type="text"
              placeholder={"ГОСТ..."}
              className="form-input"
            />
            <div className="form-label">Теги технического задания</div>
            <CreatableSelect
              defaultValue={this.state.tzTags}
              isMulti
              options={tags}
            />
          </div>
          <div>
            <button
              className="main-btn update-project"
              onClick={this.updateTz.bind(this, this.props.id)}
            >
              Обновить информацию о техническом задании
            </button>
            {this.props.owner.id === this.props.auth.user.id ? (
              <button
                className="main-btn delete-project"
                onClick={this.deleteTz.bind(this, this.props.id)}
              >
                Удалить техническое задание
              </button>
            ) : null}
          </div>
        </div>
      );
    }

    // Create TZ modal
    else
      return (
        <div className="modal" style={{ minHeight: "700px" }}>
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Создайте техническое задание</h1>
          <div className="form-group">
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
            Выберите Государственный стандарт, по которому будет проектироваться
            ТЗ
            <Select
              onChange={(value) => this.setState({ tzGost: value.value })}
              options={options}
            />
            <div className="form-label">Теги технического задания</div>
            <CreatableSelect
              onChange={this.handleTagsChange}
              isMulti
              options={tags}
            />
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
  part: state.parts.part,
  parts: state.parts,
});

export default connect(mapStateToProps, {
  createTz,
  updateTz,
  deleteTz,
  getGosts,
  createTag,
  getTags,
  createPart,
  getPart,
  createProject,
  updateProject,
  deleteProject,
  createTask,
  deleteTask,
  updateTask,
  updatePart
})(withRouter(Modal));
