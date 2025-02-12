import { UserSchema } from "@/schemas/User"
import { createZodFetcher } from "zod-fetch"

const fetchUser = createZodFetcher()

export async function getUser(id: number) {
    const user = await fetchUser(
        UserSchema,
        `http://localhost:3500/users/${id}`,
        { cache: 'no-store' },
    )

    return user
}