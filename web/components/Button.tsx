import MuiButton from '@mui/material/Button';

export default function Button({
  id,
  text,
  color = 'primary',
  onClick,
  refer,
  size = 'medium',
  ...rest
}: {
  id?: number;
  text: string | JSX.Element;
  color?:
    | 'error'
    | 'info'
    | 'inherit'
    | 'success'
    | 'warning'
    | 'primary'
    | 'secondary'
    | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: 'small' | 'medium' | 'large';
  [key: string]: any;
}) {
  return (
    <MuiButton
      onClick={onClick}
      variant='contained'
      color={color}
      sx={{ height: '45px', padding: '10px' }}
      ref={refer}
      size={size}
      {...rest}
    >
      {text}
    </MuiButton>
  );
}
