import {
    MessageConsumerOptions,
    Matchers
} from "@pact-foundation/pact"
import serviceFactory from "@pact-foundation/pact-node"

export type EventHandler<T> = (event: CustomEvent<T>) => void

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

export class CustomEventConsumerPact {

    protected state: any = {}
    protected config: MessageConsumerOptions

    constructor(config: MessageConsumerOptions) {
        this.config = config
    }

    public given(providerState: string): CustomEventConsumerPact {
        this.state.providerStates = [
            {
                name: providerState,
            },
        ]

        return this

    }

    public expectsToReceive(description: string): CustomEventConsumerPact {
        this.state.description = description
        return this
    }

    public withEvent<T>(eventName: string, payload: T): CustomEventConsumerPact {
        this.state.eventName = eventName;
        this.state.contents = payload

        return this
    }

    public async verify<T>(eventHandler: EventHandler<T>): Promise<void> {
        const payload = Matchers.extractPayload(clone(this.state))

        return new Promise<void>((res, rej) => {
            global.addEventListener(this.state.eventName, (evt: CustomEvent<T>) => {
                try {
                    eventHandler(evt)
                } catch (err) {
                    return rej(err)
                }

                res()
            })
            global.dispatchEvent(new CustomEvent(this.state.eventName, { detail: payload }))
        }).then(_ => {
            serviceFactory.createMessage(
                {
                    consumer: this.config.consumer,
                    content: JSON.stringify(this.state),
                    dir: this.config.dir,
                    pactFileWriteMode: this.config.pactfileWriteMode,
                    provider: this.config.provider,
                    spec: 3,
                }
            )
        })
    }
}
