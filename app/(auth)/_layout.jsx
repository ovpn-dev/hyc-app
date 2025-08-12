import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "../../components";

const AuthLayout = () => {
  // Always redirect to home - auth screens are no longer needed
  return <Redirect href="/home" />;

  // Keeping the commented code below in case you ever want to revert back
  /*
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
  */
};

export default AuthLayout;
