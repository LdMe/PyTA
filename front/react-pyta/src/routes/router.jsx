import {createBrowserRouter} from 'react-router-dom';
import Index from '../components/Index';

const Router = createBrowserRouter([
    {
        path: '/', 
        element: <Index/>, 
        exact: true
    },
    {
        path: 'chat/:defaultChatName',
        element: <Index />,
    }
]);

export default Router;