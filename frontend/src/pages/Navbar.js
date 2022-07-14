import React from 'react'
import {Link as RouterLink, Outlet} from 'react-router-dom'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';






const drawerWidth = 240;

export default function Navbar(props: Props) {

  
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          IMG APP
        </Typography>
        <Divider />
        <List>
        

            <ListItem key={1} disablePadding >
              <Button component={RouterLink} to="/">
              Home
              </Button>
            </ListItem>

            <ListItem key={2} disablePadding>
              <Button component={RouterLink} to="/gallery">
              Gallery
              </Button>
            </ListItem>

            {/* {(isAuthenticated && (
           <ListItem key={3} disablePadding>
           <Button component={RouterLink} to="/gallery">
           Logout
           </Button>
         </ListItem>
          ))} */}
{/* 
{(!isAuthenticated && (
           <ListItem key={3} disablePadding>
           <Button component={RouterLink} to="/gallery">
           Login
           </Button>
         </ListItem>
          ))} */}


            

          
           

        </List>
      </Box>
    );
  
    const container = window !== undefined ? () => window().document.body : undefined;
  
    return (
      <Box sx={{ display: 'flex' }}>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Image App
            </Typography>
            <Box  sx={{ display: { xs: 'none', sm: 'block' } }}>
           

          <Button
          sx={{mx: 1}}
          variant="contained"
          style={{ backgroundColor: '#42a5f5', color: '#fff' }}
          component={RouterLink}
          to="/">
          Home
          </Button>   

          <Button
          variant="contained"
          style={{ backgroundColor: '#42a5f5', color: '#fff' }}
          component={RouterLink}
          to="/gallery">
          Gallery
          </Button>    

     


            

        
   


    

            {/* <Button
            variant="contained"
            sx={{mx: 1}}
            style={{ backgroundColor: '#42a5f5', color: '#fff' }}
              
            >
            Login
            </Button>
          */}




      
            {/* <Button
            variant="contained"
            sx={{mx: 1}}
            style={{ backgroundColor: '#42a5f5', color: '#fff' }}
            onClick={() => logout()}    
            >
            Logout
            </Button> */}
      


     

            
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component="main" sx={{ p: 3, width:"100%" }}>
          <Toolbar />
          <Outlet/>
         
        </Box>
      </Box>
    );
  }