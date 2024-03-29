import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { WithFirebaseApiProps, WithFirebaseApi } from "./Firebase";
import Header from "./components/Header";
import Onboarding from "./components/Onboarding";
import MainFeed from "./components/MainFeed";
import ExploreFeed from "./components/ExploreFeed";
import ProfilePage from "./components/ProfilePage";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { handleUserChange } from "./redux/useSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const isLoadingState = (state: RootState): boolean => {
  return state.user.userId === undefined;
};

const Body = () => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const userInfo = useAppSelector(
    (state: RootState) => state.user.userInfo.value
  );
  const userInfoLoadState = useAppSelector(
    (state: RootState) => state.user.userInfo.loadState
  );

  if (userId === null) {
    return (
      <>
        <Typography>Please Log In</Typography>
      </>
    );
  }

  if (userInfoLoadState === "loading") {
    return <CircularProgress />;
  }
  if (userInfoLoadState === "failed" || userInfo === undefined) {
    return (
      <>
        <Typography>Someting Failed</Typography>
      </>
    );
  }
  if (userInfo === null) {
    return <Onboarding />;
  }
  return (
    <Routes>
      <Route path="/" element={<MainFeed />} />
      <Route path="/explore" element={<ExploreFeed />} />
      <Route path="/user/:userId" element={<ProfilePage />} />
    </Routes>
  );
};

function App(props: WithFirebaseApiProps) {
  const isLoading = useAppSelector(isLoadingState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return props.firebaseApi.onAuthStateChanged((user) => {
      if (user) {
        dispatch(handleUserChange(props.firebaseApi, user.uid));
      } else {
        dispatch(handleUserChange(props.firebaseApi, null));
      }
    });
  }, [dispatch, props.firebaseApi]);

  if (isLoading) {
    return <CircularProgress sx={{ margin: "auto" }} />;
  }

  return (
    <BrowserRouter>
      <Header />
      <Container sx={{ paddingTop: 3 }}>
        <Box sx={{ margin: "auto" }}>
          <Body />
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default WithFirebaseApi(App);
