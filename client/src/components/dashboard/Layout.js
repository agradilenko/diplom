import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTzs } from "../../actions/tzActions";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";

import Spinner from "../common/Spinner";
import SideNav from "./SideNav/SideNav";
import TopNav from "./TopNav/TopNav";
import Dashboard from "./MainContent/Dashboard";
import Tasks from "./MainContent/Tasks";
import Project from "./MainContent/Project/Project";
import NotFound from "../404/404";

import "./Layout.scss";

class Layout extends Component {
  componentDidMount() {
    this.props.getTzs();
  }

  render() {
    const { tzs, tzsLoading } = this.props.tzs;
    let dashboardContent;

    if (tzs === null || tzsLoading) {
      dashboardContent = <Spinner />;
    } else if (tzs.length > 0) {
      dashboardContent = (
        <>
          <SideNav projects={tzs} />
          <div className="right">
            <TopNav />
            <Switch>
              <Route exact path="/dashboard" tzs={tzs} component={Dashboard} />
              <Route exact path="/tasks" projects={tzs} component={Tasks} />
              <Route exact path="/projects/:project" component={Project} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </>
      );
    } else {
      dashboardContent = (
        <>
          <SideNav />
          <div className="right">
            <TopNav />
            <Switch>
              <Route exact path="/dashboard" tzs={[]} component={Dashboard} />
              <Route exact path="/tasks" component={Tasks} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </>
      );
    }

    return (
      <Router>
        <div className="wrapper">{dashboardContent}</div>
      </Router>
    );
  }
}

Layout.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  tzs: state.tzs,
});

export default withRouter(
  connect(mapStateToProps, { getTzs})(Layout)
);
