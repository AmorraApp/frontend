import useAuth from "#src/common/auth";
import Button from '@mui/material/Button';

export default function LoginButton (props) {
  const { login } = useAuth();

  return <Button variant="outlined" {...props} onClick={login}>Log In</Button>;
}

