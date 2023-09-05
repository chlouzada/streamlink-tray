import { Container } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Container className="min-h-screen flex flex-col justify-center" size="1">
      <Outlet />
    </Container>
  );
}

export default App;
