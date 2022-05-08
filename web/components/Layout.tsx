import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Sidebar from '@components/sidebar/Sidebar';
import { User } from '@prisma/client';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  hasSidebar?: boolean;
  userInfo?: User;
}

const APP_BAR_DESKTOP = 40;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  overflowY: 'hidden',
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function Layout({
  title,
  children,
  hasSidebar = true,
  userInfo,
}: LayoutProps) {
  return (
    <RootStyle>
      {hasSidebar ? <Sidebar userInfo={userInfo} /> : null}
      <Head>
        <title>{title}</title>
      </Head>
      <MainStyle>{children}</MainStyle>
    </RootStyle>
  );
}
