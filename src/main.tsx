//eslint disable

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
// import { CombineProviders, providers} from './context'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

/** Configure Apollo Client */
// const token = localStorage.getItem('access_token') || ''
export const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
  // headers: {
  //   Authorization: `Bearer ${token}`
  // }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ChakraProvider>
  </StrictMode>
)
