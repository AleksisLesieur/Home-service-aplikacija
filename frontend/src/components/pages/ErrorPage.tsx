import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return <div>Error Page</div>;
};

export default ErrorPage;
