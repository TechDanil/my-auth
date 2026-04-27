import { ComponentType, JSX, PropsWithChildren } from 'react'

type ProviderProps = PropsWithChildren<Record<string, unknown>>
type ProviderComponent = ComponentType<ProviderProps>

type ProviderEntry = {
  component: ProviderComponent
  props?: Record<string, unknown>
}

export const composeProviders = (providers: ProviderEntry[]) => {
  return function ComposedProviders({
    children
  }: PropsWithChildren): JSX.Element {
    return providers.reduceRight<JSX.Element>(
      (acc, { component: Provider, props }) => {
        return <Provider {...props}>{acc}</Provider>
      },
      children as JSX.Element
    )
  }
}
