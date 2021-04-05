import React, { Component } from "react";
import "./MainContent.scss";
import "./Dashboard.scss";

import { connect } from "react-redux";

import Modal from "./Modal/Modal";
import {Select} from "antd";

class Dashboard extends Component {
  state = {
    modal: false,
    edit: false,
    name: "",
    id: "",
    owner: {},
  };

  toggleModal = (e) => {
    this.setState({ modal: !this.state.modal, edit: false });
  };

  toggleEditModal = (name, id, owner, e) => {
    e.stopPropagation();

    this.setState({
      modal: !this.state.modal,
      edit: !this.state.edit,
      name: name,
      id: id,
      owner: owner,
    });
  };

  render() {
    const { tzs } = this.props.tzs;
    const { Option } = Select;

    // const { gosts } = this.props.gosts;
    // console.log(gosts);
    let content;

    let tzData = tzs.sort().map((tz) => (
      <div
        key={tz._id}
        className="project-icon"
        onClick={() => this.props.history.push(`/projects/${tz._id}`)}
      >
        <div className="project-name">{tz.name}</div>
        {/*<div*/}
        {/*  className="project-info-button"*/}
        {/*  onClick={this.toggleEditModal.bind(*/}
        {/*    this,*/}
        {/*    tz.name,*/}
        {/*    project.teamMembers,*/}
        {/*    project._id,*/}
        {/*    project.owner*/}
        {/*  )}*/}
        {/*>*/}
        {/*  Редактировать информацию о ТЗ*/}
        {/*</div>*/}
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
