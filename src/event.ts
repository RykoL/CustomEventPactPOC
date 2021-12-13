
export interface Data {
    name: string,
    year: number,
    id: number
}

export type Callback = (data: CustomEvent) => void
export type Cleanup = () => void

const eventName = "dataEvent"

export const subscribeToEvent = (callback: Callback): Cleanup => {

    document.addEventListener(eventName, callback, false)
    return () => document.removeEventListener(eventName,callback)
}

export const buildCustomEvent = (data: Data) => new CustomEvent<Data>(eventName, {detail: data})

export const sendEvent = (data: Data): void => {
    document.dispatchEvent(buildCustomEvent(data))
}
