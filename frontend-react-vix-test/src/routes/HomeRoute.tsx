import { LoadingApp } from "../auth/LoadingApp";
import { PrivatePage } from "../auth/PrivatePage";
import { HomePage } from "../pages/Home";

export const HomeRouter = {
  path: "/",
  element: (
    <PrivatePage>
      <LoadingApp notLoginPage>
        <HomePage />
      </LoadingApp>
    </PrivatePage>
  ),
};
