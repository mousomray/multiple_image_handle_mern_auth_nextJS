import React from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BookIcon from '@mui/icons-material/Book';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logout, check_token } from '../Auth/authslice';
import { useEffect } from 'react';

const pages = ['Home', 'Product'];
const settings = ['Dashboard', 'Update Password', 'Logout'];

const Navbar = () => {
  const dispatch = useDispatch();
  const { Logouttoggle } = useSelector((state) => state?.Auth);
  const name = Cookies.get("name");
  const image = Cookies.get("profile_pic");
  console.log("My chobi...", image)
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); // Use router.push for navigation
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const isActive = (path) => router.pathname === path;

  // This step is required for to stop page refreshing problem in logout button
  useEffect(() => {
    dispatch(check_token())
  }, [])

  return (
    <>
      {/* Navbar Start */}
      <AppBar position="fixed" sx={{ background: 'green', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <BookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: '40px', color: '#FFD700' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: '#FFD700',
                textDecoration: 'none',
              }}
            >
              BLOG APP
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Link
                      href={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                      passHref
                    >
                      <Typography
                        sx={{
                          textDecoration: 'none',
                          color: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? '#FFD700' : '#333',
                          fontWeight: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? 'bold' : 'normal',
                        }}
                      >
                        {page}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              {pages.map((page) => (
                <Link
                  key={page}
                  href={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                  passHref
                >
                  <Button
                    sx={{
                      my: 2,
                      color: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? '#FFD700' : '#fff',
                      fontSize: '16px',
                      fontWeight: isActive(page === 'Home' ? '/' : `/${page.toLowerCase()}`) ? '700' : '600',
                      textTransform: 'capitalize',
                      marginRight: '15px',
                      '&:hover': { color: '#FFD700' },
                    }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {Logouttoggle ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar src={image ? `${process.env.NEXT_PUBLIC_API_URL}${image}` : ""} alt={name || "User"} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                        {setting === 'User' ? (
                          <Typography textAlign="center">User: {name}</Typography>
                        ) : setting === 'Update Password' ? (
                          <Typography textAlign="center">
                            <Link href="/updatepassword">Update Password</Link>
                          </Typography>
                        ) : setting === 'Dashboard' ? (
                          <Typography textAlign="center">
                            <Link href="/dashboard">Dashboard</Link>
                          </Typography>
                        ) :
                          (
                            <Typography textAlign="center">
                              {setting}
                            </Typography>
                          )

                        }
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Link href="/login" passHref>
                  <Button sx={{ color: '#FFD700', fontWeight: '600' }}>Login</Button>
                </Link>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Navbar End */}
    </>
  );
};

export default Navbar; 
