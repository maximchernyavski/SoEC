import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './Main.css'
import Devices from '../../Menus/Devices';
import Diagnostic from '../../Menus/Diagnostic';
import Norm from '../../Menus/Norm';
import Report from '../../Menus/Report';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Main() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{minWidth:'100vh', minHeight:'100vh' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
            <Tab label="Devices" {...a11yProps(0)} />
            <Tab label="Diagnostic" {...a11yProps(1)} />
            <Tab label="Norm" {...a11yProps(2)} />
            <Tab label="Report" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Devices />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Diagnostic />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Norm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Report />
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default Main