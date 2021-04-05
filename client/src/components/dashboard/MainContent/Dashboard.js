import React, { Component } from "react";
import "./MainContent.scss";
import "./Dashboard.scss";

import { connect } from "react-redux";

import Modal from "./Modal/Modal";
import { Select } from "antd";
import {loginUser} from "../../../actions/authActions";

class Dashboard extends Component {
  state = {
    modal: false,
    edit: false,
    name: "",
    id: "",
    description: "",
    gost: "",
    tags: [],
    owner: {},
  };

  toggleModal = (e) => {
    this.setState({ modal: !this.state.modal, edit: false });
  };

  toggleEditModal = ( name, id, description, gost, tags, owner, e) => {
    e.stopPropagation();
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

  render() {
    const { tzs } = this.props.tzs;
    let content;

    let tzData = tzs.sort().map((tz) => (
      <div
        key={tz._id}
        className="project-icon"
        onClick={() => this.props.history.push(`/projects/${tz._id}`)}
      >
        <div className="project-name">{tz.name}</div>
        <div
          className="project-info-button"
          onClick={this.toggleEditModal.bind(
            this,
            tz.name,
            tz._id,
            tz.description,
            tz.gost,
            tz.tags,
            tz.owner
          )}
        >
          Редактировать информацию о ТЗ
        </div>
        <div className="project-info-button">Перейти в ТЗ</div>
      </div>
    ));

    if (tzs.length > 0) {
      // At least one project
      content = (
        <>
          <button className="main-btn" onClick={this.toggleModal}>
            Создайте новое техническое задание
          </button>
          <div className="modal-wrapper">
            <Modal
              onClose={this.toggleModal}
              modal={this.state.modal}
              edit={this.state.edit}
              name={this.state.name}
              description={this.state.description}
              gost={this.state.gost = "60696d837244ac8e63f6a2ce" ? "ГОСТ" +
                " 34.602-89": "ГОСТ-19.201-78" }
              selectedtags={this.state.tags}
              id={this.state.id}
              owner={this.state.owner}
            />
          </div>
          <div className="projects-wrapper">{tzData}</div>
        </>
      );
    } else {
      // No tzs
      content = (
        <>
          <div className="projects">
            <div className="no-projects">
              <h1 className="header">
                У вас нет созданных Технических Заданий
              </h1>
              <button className="main-btn" onClick={this.toggleModal}>
                Создайте ваше первое техническое задание
              </button>
              <div className="modal-wrapper">
                <Modal onClose={this.toggleModal} modal={this.state.modal} />
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="main-content">
        <h1 className="header">Ваши технические задания</h1>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tzs: state.tzs,
});

export default connect(mapStateToProps, {})(Dashboard);
