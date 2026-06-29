import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { topic, platform, style } = await req.json()

    // -----------------------------
    // AI 请求（可能成功也可能失败）
    // -----------------------------
    const aiRequest = client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `
Create a short social media caption.

Topic: ${topic}
Platform: ${platform}
Style: ${style}

Return in this format:
Title:
Caption:
Hashtags:
          `,
        },
      ],
    })

    // -----------------------------
    // 超时控制（10秒）
    // -----------------------------
    const completion = await Promise.race([
      aiRequest,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      ),
    ])

    const content = completion?.choices?.[0]?.message?.content

    // -----------------------------
    // AI 成功返回
    // -----------------------------
    if (content) {
      return NextResponse.json({
        title: "AI Generated Caption",
        caption: content,
        hashtags: "#AI #generated #caption",
        mode: "ai",
      })
    }

    // -----------------------------
    // fallback（极少触发）
    // -----------------------------
    return NextResponse.json({
      title: "AI Caption Generator",
      caption:
        "System generated response due to unstable AI service connection.",
      hashtags: "#AI #fallback #system",
      mode: "fallback",
    })
  } catch (error) {
    // -----------------------------
    // 任何错误都走这里（关键）
    // -----------------------------
    return NextResponse.json({
      title: "AI Caption Generator",
      caption:
        "Fallback mode activated due to AI timeout or network instability.",
      hashtags: "#AI #fallback #system #demo",
      mode: "fallback",
    })
  }
}