import Anthropic from '@anthropic-ai/sdk'
import type { Activity } from '../types'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

interface ActivityPrefs {
  setting: 'indoor' | 'outdoor' | 'either'
  energy: 'active' | 'relaxed' | 'either'
  duration: 'short' | 'half-day' | 'full-day'
  season: string
}

export async function generateActivities(prefs: ActivityPrefs): Promise<Activity[]> {
  const prompt = `Suggest 6 family activity ideas suitable for a family with young children (ages roughly 3–10).

Preferences:
- Setting: ${prefs.setting}
- Energy level: ${prefs.energy}
- Duration: ${prefs.duration === 'short' ? 'under 1 hour' : prefs.duration === 'half-day' ? '2–3 hours' : 'a full day out'}
- Season/time of year: ${prefs.season}

Return a JSON array of exactly 6 activities. Each object must have these fields:
- title: string (short, 3–5 words)
- description: string (2 sentences, practical and encouraging)
- duration: string (e.g. "45 mins", "2–3 hours")
- tags: string[] (2–3 tags like "outdoor", "creative", "free", "rainy day")

Return only the JSON array, no other text.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(text)

  return parsed.map((a: Omit<Activity, 'id' | 'saved' | 'generatedAt'>, i: number) => ({
    ...a,
    id: `gen-${Date.now()}-${i}`,
    saved: false,
    generatedAt: Date.now(),
  }))
}
