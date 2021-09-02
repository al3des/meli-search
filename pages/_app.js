import '../styles/globals.css'
import Head from 'next/head'
import { ThemeProvider, makeStyles, CssBaseline, createTheme } from '@material-ui/core'


const theme = createTheme({
 
});

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
    <meta
  name="viewport"
  content="minimum-scale=1, initial-scale=1, width=device-width"
/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /></Head>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider></>
}

export default MyApp
