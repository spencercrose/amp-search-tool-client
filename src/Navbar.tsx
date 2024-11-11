import React from 'react';
import { FormControlLabel, IconButton, Menu, MenuItem, Switch } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MenuProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const NavbarComponent: React.FC<MenuProps> = ({ mode, toggleMode }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleMode}
              />
            }
            label="Dark mode"
          />
        </MenuItem>
      </Menu>
      </>
  );
};

export default NavbarComponent;