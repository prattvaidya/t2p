import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card, { CardContent, CardMedia } from "material-ui/Card";
import Typography from "material-ui/Typography";
import ttpImg from "./../assets/images/ttp-home.jpg";
import { Link } from "react-router-dom";
import Grid from "material-ui/Grid";
import auth from "./../auth/auth-helper";
import FindPartners from "./../partner/FindPartners";
import MyPartners from "./../partner/MyPartners";

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  }
});

class Home extends Component {
  state = {
    defaultPage: true
  };
  init = () => {
    if (auth.isAuthenticated()) {
      this.setState({ defaultPage: false });
    } else {
      this.setState({ defaultPage: true });
    }
  };
  componentWillReceiveProps = () => {
    this.init();
  };
  componentDidMount = () => {
    this.init();
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.defaultPage && (
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <Typography
                  type="headline"
                  component="h2"
                  className={classes.title}
                >
                  Home Page
                </Typography>
                <CardMedia
                  className={classes.media}
                  image={ttpImg}
                  title="All your points"
                />
                <CardContent>
                  <Typography type="body1" component="p">
                    Welcome to Todos Tus Puntos.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {!this.state.defaultPage && (
          <Grid container spacing={24}>
            <Grid item xs={5} sm={5}>
              <MyPartners />
            </Grid>
            <Grid item xs={9} sm={7}>
              <FindPartners />
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
