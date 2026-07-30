import { RouterProvider } from "react-router"
import {router} from "./app.routes"
import { AuhtProvider } from "./features/auth/auth.context"

const App = () => {


  return (
    
      <AuhtProvider>
        <RouterProvider router={router}/>
      </AuhtProvider>
    
  )
}

export default App