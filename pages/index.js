import { useEffect, useRef, useState } from "react"

import Image from "next/image"

import axios from "axios"

import styles from "../styles/Home.module.css"
import { parseConfig } from "browserslist"

function getQuestions(productId, questions) {
  return questions
    .filter((q) => q.item_id === productId)
    .map((x) => x.questions)
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [questions, setQuestions] = useState([])
  const [descriptions, setDescriptions] = useState([])
  const ref = useRef(null)

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

  console.log(questions)

  return (
    <div className={`${styles.container} `}>
      <button onClick={() => setSearch("rx480 8gb")}>RX 480 8GB</button>
      <button onClick={() => setSearch("rx580 8gb")}>RX 580 8GB</button>
      <button onClick={() => setSearch("rx570 8gb")}>RX 570 8GB</button>
      <button onClick={() => setSearch("rx5700 xt 8gb")}>RX 5700 xt 8GB</button>

      <div>
        {results.map((p) => (
          <div className={styles.card}>
            <a href={p.permalink} target="_blank">
              <h1>{p.title}</h1>
            </a>
            <Image src={p.thumbnail} height={200} width={200} />
            <p>$ {p.price.toLocaleString("en-US")}</p>
              <adddress>{p.address.state_name}, {p.address.city_name}</adddress>
              {p.shipping.free_shipping && <div className={styles.pill}>envio gratis</div>}
              {p.accepts_mercadopago && <div className={styles.pill}>acepta mercado pago</div>}
            <p>
              {descriptions &&
                descriptions
                  .filter((d) => d.item_id == p.id)
                  .map((e) => e.description)}
            </p>
            <div className={styles.accordion}>
              {questions &&
                getQuestions(p.id, questions).map((q) =>
                  q.map((q) => (
                    <>
                      <p className="bold">{q.text}</p>
                      <p>{q.answer && q.answer.text}</p>
                    </>
                  ))
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// https://api.mercadolibre.com/sites/MLA/search?q=Motorola%20G6
// https://api.mercadolibre.com/questions/search?item_id=MLA608007087
