"use client"

import { useState } from "react"

export default function Home() {
  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState("xiaohongshu")
  const [style, setStyle] = useState("calm")

  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [hashtags, setHashtags] = useState("")

  const [loading, setLoading] = useState(false)

  const generate = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          platform,
          style,
        }),
      })

      const data = await res.json()

      console.log("API result:", data)

      setTitle(data.title || "")
      setCaption(data.caption || "")
      setHashtags(data.hashtags || "")
    } catch (err) {
      console.error(err)

      setTitle("Error")
      setCaption("Failed to generate content")
      setHashtags("#error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>AI Caption Generator</h1>

      <input
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      >
        <option value="xiaohongshu">Xiaohongshu</option>
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
      </select>

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      >
        <option value="calm">Calm</option>
        <option value="vibrant">Vibrant</option>
        <option value="aesthetic">Aesthetic</option>
      </select>

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      <hr />

      <h2>{title}</h2>
      <p style={{ whiteSpace: "pre-line" }}>{caption}</p>
      <p>{hashtags}</p>
    </main>
  )
}