import {AuthPage} from "../../components/pages/auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: {username: "demo@refine.dev", password: "demodemo"},
      }}
    />
  );
};
