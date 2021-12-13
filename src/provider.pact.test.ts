import * as path from 'path'
import {
    MessageProviderPact
} from "@pact-foundation/pact"
import { buildCustomEvent } from './event'

describe("produces a custom event", () => {

    const p = new MessageProviderPact({
        messageProviders: {
            "an custom event": () => Promise.resolve(buildCustomEvent({ id: 1.0102312, name: "someData", year: 2021 }))
        },
        provider: "CustomEventProvider",
        providerVersion: "1.0.0",
        pactUrls: [
            path.resolve(
                process.cwd(),
                "pacts",
                "customeventconsumer-customeventprovider.json"
            ),
        ],
    })

    it("sends a valid data object", async () => {
        await p.verify()
    })
})
