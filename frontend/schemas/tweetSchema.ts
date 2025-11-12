
import { z} from "zod"

export const tweetSchema = z.object({
    content: z.string().min(10, "Tweet must be atleast 10 charecters").max(300, "Tweet is too long").trim()
})