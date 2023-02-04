import Head from "next/head";
import { Suspense, useCallback, useRef, useState } from "react";
import styles from "./index.module.css";
import Query from '../components/query'

export default function Home() {
  const [result, setResult] = useState();
  const promptInputRef = useRef(null)

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptInputRef.current.value }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Req failed, status: ${response.status}`);
      }

      setResult(data.result);
      // promptInputRef("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const keyPress = (event) => {
    if (event.keyCode == 13 && (event.metaKey || event.ctrlKey)) {
      onSubmit(event)
    }
  }


  const namesParser = useCallback(names => {
    if (names) {
      const namesArr = names.split(', ')
      return namesArr.map(item => <li key={item}> {item} </li>)
    }
    return ''
  }, [result])



  return (
    <div>
      <Head>
        <title>open gpt</title>
        <link rel="icon" href="/chip.png" />
      </Head>

      <main className={styles.main}>
        <img src="/chip.png" className={styles.icon} />
        <h3>open earth</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text-area"
            name="prompt"
            className={styles.prompt}
            rows={5}
            cols={50}
            placeholder="ask me anything then press ⌘ + ↵"
            defaultValue=""
            ref={promptInputRef}
            // onChange={(e) => setPromptInput(e.target.value)}
            onKeyUp={keyPress}
            autoFocus={true}
          />
          {/* <input type="submit" value="Generate names" /> */}
        </form>
        <Suspense fallback={<span>loading...</span>}>
          <Query result={result} />
        </Suspense>

      </main>
    </div>
  );
}
