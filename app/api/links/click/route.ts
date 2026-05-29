import { NextRequest } from "next/server"

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

function isValidDocumentId(value: string) {
  return value.length > 0 && !value.includes("/")
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId?: string
      linkId?: string
    }
    const userId = body.userId?.trim()
    const linkId = body.linkId?.trim()

    if (!userId || !linkId) {
      return Response.json({ error: "Missing userId or linkId" }, { status: 400 })
    }

    if (!isValidDocumentId(userId) || !isValidDocumentId(linkId)) {
      return Response.json({ error: "Invalid userId or linkId" }, { status: 400 })
    }

    const apiKey = getRequiredEnv("NEXT_PUBLIC_FIREBASE_API_KEY")
    const projectId = getRequiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID")
    const documentName = `projects/${projectId}/databases/(default)/documents/users/${userId}/links/${linkId}`
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          writes: [
            {
              transform: {
                document: documentName,
                fieldTransforms: [
                  {
                    fieldPath: "clickCount",
                    increment: { integerValue: "1" },
                  },
                ],
              },
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Click count failed:", errorText)
      return Response.json({ error: "Failed to update click count" }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Click count failed:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
