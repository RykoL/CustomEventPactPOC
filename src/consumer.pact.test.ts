import * as path from 'path'
import {
    Matchers,
    MessageProviderPact
} from "@pact-foundation/pact"
import { CustomEventConsumerPact } from './customEventConsumer'
import { customEventConsumer } from "./consumer"
import { buildCustomEvent, Data } from './event'

const messagePact = new CustomEventConsumerPact({
    consumer: "CustomEventConsumer",
    dir: path.resolve(process.cwd(), "pacts"),
    pactfileWriteMode: "update",
    provider: "CustomEventProvider",
})

describe("receive a custom event", () => {
    it("accepts a valid data object", async () => {
        await messagePact
            .expectsToReceive("an custom event")
            //.withContent(Matchers.like(new CustomEvent<Data>("asd", { detail:  })))
            .withEvent("custom", { name: Matchers.like("foo"), year: Matchers.like(2021), id: Matchers.like(1) })
            // 4 Verify consumers' ability to handle messages
            .verify(customEventConsumer)
    })
})

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
