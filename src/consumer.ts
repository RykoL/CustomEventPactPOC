import { Data } from './event'

export const customEventConsumer = (data: CustomEvent<Data>) => {
    if (data.detail.name !== undefined &&
        data.detail.id !== undefined &&
        data.detail.year !== undefined) {
        throw new Error("Invalid data")
    }
}
