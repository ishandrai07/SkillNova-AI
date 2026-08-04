import { RouterProvider } from "react-router"
import {router} from "./app.routes"
import { AuhtProvider } from "./features/auth/auth.context"
import { InterviewProvider } from "./features/interview/interview.context"
const App = () => {


  return (
    
      <AuhtProvider>
        <InterviewProvider>
          <RouterProvider router={router}/>
        </InterviewProvider>
      </AuhtProvider>
    
  )
}

export default App