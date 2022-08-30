import Header from './Header';
import SideBar from './SideBar';
import { withStyles } from '@material-ui/core';
import styles from './styles/AppStyles';

function App({ classes }) {
  return (
    <div className={classes.App}>
      <Header />
      <SideBar />
    </div>
  );
}

export default withStyles(styles)(App);
