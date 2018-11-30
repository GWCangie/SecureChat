import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
});


function BottomAppBar(props) {
  const { classes } = props;
  let input ='test';
  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
            Messages
        </Typography>
        <List className={classes.list}>
          {props.messages.map( msg => (
            <Fragment >
              <ListItem button>
                <ListItemText primary={msg.split(";")[0]} secondary={msg.split(";")[1]} />
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Paper>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
        Default Room
          <div>
          <TextField
        id="standard-name"
          label="Name"
          className={classes.textField}
          value={input}
          margin="normal"
        />
            <IconButton color="inherit">
              <AddIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

BottomAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomAppBar);