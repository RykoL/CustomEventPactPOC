import {subscribeToEvent, sendEvent} from './event'

describe("event", () => {

    it("receives data upon subscribing", () => {
        const receiver = jest.fn()

        subscribeToEvent(receiver)

        sendEvent({name: "foo", id: 1, year: 2021})

        expect(receiver).toHaveBeenCalledTimes(1)
    })

    it("unsubscribes from event", () => {
        const receiver = jest.fn()

        subscribeToEvent(receiver)()
        sendEvent({name: "foo", id: 1, year: 2021})

        expect(receiver).not.toHaveBeenCalled()
    })
})
