const styles = {
  Content: {
    height: '91vh !important',
  },
  Sidebar: {
    display: 'flex !important',
    flexDirection: 'row !important',
    height: '91vh !important',
    backgroundColor: '#fffcf8 !important',
    color: 'black !important',
  },
  Menu: {
    backgroundColor: 'rgb(221 221 221) !important',
    width: '11vw !important',
    color: 'white !important',
    paddingTop: '11px !important',
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'center !important',
    justifyContent: 'flex-start !important',
  },
  MenuList: {
    marginLeft: '-8px !important',
    marginTop: '.5rem',
  },
  MenuListItem: {
    height: '5vh !important',
    backgroundColor: 'rgb(221 221 221) !important',
    borderRight: '6px solid white !important',
    borderLeft: '6px solid white !important',
    borderTop: '3px solid white !important',
    borderBottom: '3px solid white !important',
    '&:hover': {
      backgroundColor: 'black !important',
      color: 'white !important',
    },
  },
  MenuListItemRendered: {
    backgroundColor: 'black !important',
    color: 'white !important',
  },
  NoDataText: {
    marginRight: '10% !important',
    marginTop: '2% !important',
    fontSize: '18px !important',
    fontWeight: '400 !important',
    letterSpacing: '1px !important',
    color: 'rgb(255, 0, 0) !important',
  },
  Table: {
    width: '89vw',
    borderRadius: '0px !important',
    overflow: 'hidden !important',
  },
  Tables: {
    overflowY: 'auto !important',
  },
  Show: {
    display: 'flex',
    transition: 'all 0.3s ease-in-out !important',
  },
  Hide: {
    display: 'none',
    transition: 'all 0.3s ease-in-out !important',
  },
};

export default styles;
