import useAuth from "#src/common/auth";
import Button from '@mui/material/Button';

export default function SignupButton (props) {
  const { signup } = useAuth();

  return <Button variant="contained" {...props} onClick={signup}>Sign Up!</Button>;
}

