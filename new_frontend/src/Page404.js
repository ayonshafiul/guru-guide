import './Page404.css'
import {Link} from 'react-router-dom';

const Page404 = () => {
    return ( 
        <div className="page-not-found">
            <h2>Page not Found!</h2>
            <h2>Here's a link for you to <Link to="/login">click!</Link></h2>
        </div>
     );
}
 
export default Page404;