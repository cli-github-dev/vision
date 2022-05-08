import { Avatar, Box, Drawer, styled, Typography } from '@mui/material';
import sidebarConfig from '@src/SidebarConfig';
import account from '@src/_mocks_/account';
import useResponsive from '@libs/hooks/useResponsive';
import Logo from './Logo';
import NavSection from './NavSection';
import { User } from '@prisma/client';

const DRAWER_WIDTH = 260;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: '#EDEFF2',
}));

export default function Sidebar({ userInfo }: { userInfo?: User }) {
  const isDesktop = useResponsive('up', 'lg');
  return (
    <RootStyle>
      {isDesktop && (
        <Drawer
          open
          variant='persistent'
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
            <Logo />
          </Box>

          <Box sx={{ mb: 5, mx: 2.5 }}>
            <AccountStyle>
              <Avatar src={account.photoURL} alt='photoURL' />
              <Box sx={{ ml: 2 }}>
                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                  {userInfo ? userInfo.userId : null}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  {userInfo ? userInfo.role : null}
                </Typography>
              </Box>
            </AccountStyle>
          </Box>

          <NavSection navConfig={sidebarConfig} />
        </Drawer>
      )}
    </RootStyle>
  );
}
