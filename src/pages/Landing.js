import Container from "@mui/material/Container";
import LoginButton from '#src/components/LoginButton';
import SignupButton from '#src/components/SignupButton';
import FlexColumn from '#src/components/FlexColumn';
import FlexRow from '#src/components/FlexRow';
import Grid from '#src/components/Grid';
import LogoWide from '#src/images/amorra-wide.svg';

export default function LandingPage () {
  return (
    <Container maxWidth="sm">
      <FlexColumn height="100vh" align="center">
        <FlexRow justify="center" sx={{ mb: 3 }}>
          <LogoWide />
        </FlexRow>
        <FlexRow justify="center" sx={{ mb: 10 }}>
          <Grid columns={2} colSpacing={10} justify="center" sx={{ width: 400 }}>
            <LoginButton size="large" />
            <SignupButton size="large" />
          </Grid>
        </FlexRow>
      </FlexColumn>
    </Container>
  );
}
