import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {

  return (<Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>)
}

export default App
