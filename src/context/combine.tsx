import { FC, createElement, ReactNode } from 'react';

type ProviderProps = {
  contexts: FC[];
  children: ReactNode;
};

const CombineProviders: FC<ProviderProps> = ({ contexts, children }) => {
  return contexts.reduceRight((acc, Provider: any) => {
    return createElement(Provider, {
      children: acc
    });
  }, children);
};

export default CombineProviders;