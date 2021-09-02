import { useEffect, useRef, useState } from "react"
import clsx from 'clsx';
import { Grid, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Container, IconButton, makeStyles, Typography } from "@material-ui/core"
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Image from "next/image"

import axios from "axios"

import styles from "../styles/Home.module.css"
import { parseConfig } from "browserslist"

function getQuestions(productId, questions) {
  return questions
    .filter((q) => q.item_id === productId)
    .map((x) => x.questions)
}


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  pill: {
    backgroundColor: '#f8beed',
    color: '#3f2f47',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    margin: '4px 2px',
    borderRadius: '16px',
  },
  avatar: {
    // backgroundColor: red[500],
  },
}));

export default function Home() {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [questions, setQuestions] = useState([])
  const [descriptions, setDescriptions] = useState([])
  const ref = useRef(null)
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (panel) => (event, isExpanded) => {
    setExpanded({ [panel]: !expanded[panel] });
  };
  const url = "https://api.mercadolibre.com"

  useEffect(() => {
    const data = axios
      .get(`${url}/sites/MLA/search?q=${search}`)
      .then((res) =>
        setResults(
          res.data.results
            .filter((e) => e.price > 30000 && e.price < 90000)
            .map((x) => x)
        )
      )
  }, [search])

  useEffect(() => {
    setQuestions([])
    const wQ =
      results &&
      results.map((e) => {
        axios.get(`${url}/questions/search?item_id=${e.id}`).then((res) => {
          setQuestions((prev) => [
            ...prev,
            { item_id: e.id, questions: res.data.questions },
          ])
        })
      })
  }, [results])

  useEffect(() => {
    setDescriptions([])
    results &&
      results.map((e) =>
        axios.get(`${url}/items?ids=${e.id}/description`).then((res) => {
          setDescriptions((prev) => [
            ...prev,
            { item_id: e.id, description: res.data[0].body.plain_text },
          ])
        })
      )
  }, [results])


  return (
    <Container
    // className={`${styles.container} `}
    >
      <button onClick={() => setSearch("rx480 8gb")}>RX 480 8GB</button>
      <button onClick={() => setSearch("rx580 8gb")}>RX 580 8GB</button>
      <button onClick={() => setSearch("rx570 8gb")}>RX 570 8GB</button>
      <button onClick={() => setSearch("rx5700 xt 8gb")}>RX 5700 xt 8GB</button>

      <Grid container>
        {results.map((p) => (
          <Grid item key={p.id}>
            <Card
              className={classes.root}>
              <a href={p.permalink} target='_blank'>
                <CardHeader title={p.title} />
                </a>

              {/* <a href={p.permalink} target="_blank">
              <h1>{p.title}</h1>
            </a> */}
              <CardMedia className={classes.media} image={p.thumbnail} />
              <CardContent>

                <Typography variant='h4'>$ {p.price.toLocaleString("en-US")}</Typography>
                <Typography paragraph variant="caption"><LocationOnIcon />{p.address.state_name}, {p.address.city_name}</Typography>
                {p.shipping.free_shipping && <Typography paragraph variant='caption' className={classes.pill}>envio gratis</Typography>}
                {p.accepts_mercadopago && <Typography paragraph variant='caption' className={classes.pill}>acepta mercado pago</Typography>}

                {descriptions &&
                  descriptions
                    .filter((d) => d.item_id == p.id)
                    .map((e) => <Typography key={p.id} paragraph noWrap={!expanded[p.id]}>{e.description}</Typography>)}


              </CardContent>
              <CardActions>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <Typography>Preguntas: </Typography>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded[p.id],
                  })}

                  onClick={handleExpandClick(p.id)}
                  aria-expanded={expanded[p.id]}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={expanded[p.id]} timeout="auto" unmountOnExit>

                {questions &&
                  getQuestions(p.id, questions).map((q) =>
                    q.map((q) => (
                        <CardContent key={q.id} className={styles.accordion}>
                          <Typography paragraph variant='subtitle2'>{q.text}</Typography>
                          <Typography paragraph >{q.answer && q.answer.text}</Typography>
                        </CardContent>
                    ))
                  )}
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

// https://api.mercadolibre.com/sites/MLA/search?q=Motorola%20G6
// https://api.mercadolibre.com/questions/search?item_id=MLA608007087
