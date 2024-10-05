import {createRoot} from "react-dom/client";
import FrontEnd from "./FrontEnd/FrontEnd";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<FrontEnd />);